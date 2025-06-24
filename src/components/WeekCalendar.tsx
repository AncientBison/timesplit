"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Separator } from '@ui/separator';
import { Button } from './ui/button';
import { MoveLeft, MoveRight } from 'lucide-react';
import useTaskManager from '~/lib/useTaskManager';
import { makeChunks, type Chunk } from '~/lib/chunkManager';
import ConfirmationDialog from './ConfirmationDialog';
import { HoverCard, HoverCardTrigger } from './ui/hover-card';
import { HoverCardContent } from '@radix-ui/react-hover-card';

// Animation control constant
const POP_ANIMATIONS = false;

export default function WeekCalendar() {
    // const { isMobile, isTablet, isDesktop, width, height } = useScreenSize();

    const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);

    function getDaysOfWeek(offset=0) {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + offset * 7));
        const days = [];

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }

        return days;
    }

    return (
        <div className="w-4/5 m-4 min-w-80 min-h-[70vh] bg-gray-100 rounded-lg shadow-lg">
            {/* Header with navigation buttons */}
            <NavigationHeader 
                selectedWeekOffset={selectedWeekOffset} 
                setSelectedWeekOffset={setSelectedWeekOffset} 
            />

            {/* Days of the week */}
            <div className="flex flex-row items-start justify-between p-4 gap-2">
                {getDaysOfWeek(selectedWeekOffset).map((day, index) => (
                    <DayOfWeek key={day.getTime()} day={day} />
                ))}
            </div>
        </div>
    );
}


function NavigationHeader({ selectedWeekOffset, setSelectedWeekOffset }: { selectedWeekOffset: number, setSelectedWeekOffset: (offset: number) => void }) {
    return (
        <div className="h-16 rounded-tl-lg rounded-tr-lg flex flex-col items-center flex-row justify-end pt-4 pl-4 pr-4 gap-2">
            <Button onClick={() => setSelectedWeekOffset(0)} variant="outline" className="lg:text-xl md:text-lg sm:text-md lg:h-10 md:h-8 sm:h-6">
                Today
            </Button>
            <Button onClick={() => setSelectedWeekOffset(selectedWeekOffset - 1)} variant="outline" size="icon" className="lg:size-10 md:size-8 sm:size-6">
                <MoveLeft />
            </Button>
            <Button onClick={() => setSelectedWeekOffset(selectedWeekOffset + 1)} variant="outline" size="icon" className="lg:size-10 md:size-8 sm:size-6">
                <MoveRight />
            </Button>             
        </div>
    )
}

function DayOfWeek({ day }: { day: Date }) {
    return (
        <div className="bg-white flex-1 rounded-lg shadow w-1/7 min-h-[calc(56vh)] flex flex-col">
            <DayOfWeekHeader day={day} />
            <DayOfWeekChunks day={day} />
        </div>
    );
};

function DayOfWeekHeader({ day }: { day: Date }) {
    return (
        <div className={`h-16 rounded-tl-lg rounded-tr-lg flex flex-col items-center m-0 flex-shrink-0 ${day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() ? "bg-blue-300" : ""}`}>
            <div className="flex flex-col items-center justify-center h-full">
                <span className="lg:text-lg md:text-[0.75rem] sm:text-[0.5rem] font-semibold">{day.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                <span className="lg:text-sm md:text-[0.6rem] sm:text-[0.45rem] text-gray-600">{day.toLocaleDateString()}</span>
            </div>
            <Separator variant="dashed" />
        </div>
    );
}

function DayOfWeekChunks({ day }: { day: Date }) {
    const { tasks, completedChunks } = useTaskManager();
    const chunks = makeChunks(tasks, completedChunks);

    day.setHours(0, 0, 0, 0); // Normalize the date to midnight for comparison

    const dayChunks = chunks.filter(chunk => {
        const chunkDate = new Date(chunk.date);
        return chunkDate.getTime() === day.getTime();
    });

    const totalDayMinutes = dayChunks.reduce((sum, c) => sum + c.durationMinutes, 0);

    return (
        <div className="flex flex-col gap-1 p-2 flex-1">
            {dayChunks.map(chunk => (
                <ChunkBlock 
                    key={chunk.task.id} 
                    chunk={chunk} 
                    chunkHeight={totalDayMinutes > 0 ? (chunk.durationMinutes / totalDayMinutes) : 0}
                />
            ))}
        </div>
    );
}

export function ChunkBlock({ chunk, chunkHeight, complete, noBg }: { chunk: Chunk; chunkHeight: number, complete?: boolean, noBg?: boolean }) {
    const { completeChunk } = useTaskManager();

    const [isHovered, setIsHovered] = useState(false);
    const [animationState, setAnimationState] = useState<'idle' | 'popping' | 'shrinking' | 'removing'>('idle');
    const [shouldRemove, setShouldRemove] = useState(false);
    
    // Handle the complete animation sequence
    const handleComplete = async () => {
        // Check if animations are disabled
        if (!POP_ANIMATIONS) {
            await completeChunk(chunk);
            return;
        }

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Skip animation, complete immediately
            await completeChunk(chunk);
            return;
        }

        // Add haptic feedback if supported
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }

        // Start pop animation
        setAnimationState('popping');
        
        // After pop, start shrinking
        setTimeout(() => {
            setAnimationState('shrinking');
        }, 100); // 200ms pop + 100ms hold
        
        // After shrink, mark for removal and complete the chunk
        setTimeout(async () => {
            setAnimationState('removing');
            setShouldRemove(true);
            await completeChunk(chunk);
        }, 300); // Total animation time before cleanup
    };

    // Don't render if marked for removal
    if (shouldRemove) return null;

    // Animation styles based on state
    const getAnimationStyles = () => {
        // If animations are disabled, return no animation styles
        if (!POP_ANIMATIONS) {
            return {};
        }

        const baseTransition = 'transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.4s ease-in, background-color 0.2s ease-out, box-shadow 0.2s ease-out';
        
        switch (animationState) {
            case 'popping':
                return {
                    transform: 'scale(1.15)',
                    zIndex: 10,
                    transition: baseTransition
                };
            case 'shrinking':
                return {
                    transform: 'scale(0.8)',
                    opacity: 0,
                    transition: 'transform 0.4s ease-in, opacity 0.4s ease-in, background-color 0.2s ease-out'
                };
            case 'removing':
                return {
                    transform: 'scale(0)',
                    opacity: 0,
                    height: 0,
                    minHeight: 0,
                    margin: 0,
                    padding: 0,
                    transition: 'all 0.2s ease-in'
                };
            default:
                return {
                    transition: baseTransition
                };
        }
    };

    // Calculate available height for chunks (56vh total - 4rem header - padding)
    // 4rem = 64px header height, converted to vh: 64px / window.innerHeight * 100
    const availableHeightVh = 56 - (64 / window.innerHeight * 100) - 2; // 2vh for padding/margins

    return (
        <div
            className="overflow-hidden w-full group rounded-lg flex flex-col relative"
            style={{
                ...(noBg ? {
                    backgroundColor: "white",
                    border: "2px solid #cdcdcd",
                } : {
                    height: (isHovered && animationState === 'idle') ? `auto` : `${availableHeightVh * chunkHeight}vh`,
                    minHeight: (isHovered && animationState === 'idle') ? `${availableHeightVh * chunkHeight}vh` : 26,
                    backgroundColor: chunk.task.colorHex,
                    boxShadow: `0 0 0 2px ${chunk.task.colorHex}80`,
                }),
                ...getAnimationStyles()
            }}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
        >
            <div className="flex-1 flex items-center justify-center flex-col gap-4">
                <div className="text-center">{chunk.task.title}</div>
                <div className="flex w-full justify-center items-center flex-col">
                    {Math.floor(chunk.durationMinutes / 60)
                        .toString()
                        .padStart(2, "0")}
                    :
                    {(chunk.durationMinutes % 60).toString().padStart(2, "0")}
                </div>
                {complete && (
                    <div className="text-center">
                        Finished {chunk.date.toLocaleDateString()}
                    </div>
                )}
            </div>
            {!complete && animationState === 'idle' && (
                <ConfirmationDialog
                    title="Mark as Complete"
                    description="Mark this chunk of your task as complete"
                    onConfirm={handleComplete}
                >
                    <Button
                        variant={noBg ? "default" : "secondary"}
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-full"
                    >
                        Done
                    </Button>
                </ConfirmationDialog>
            )}
        </div>
    );
}