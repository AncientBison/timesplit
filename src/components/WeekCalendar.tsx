"use client";

import React, { useState } from 'react';
import { Separator } from '@ui/separator';
import { Button } from './ui/button';
import { MoveLeft, MoveRight } from 'lucide-react';
import useTaskManager from '~/lib/useTaskManager';
import { makeChunks, type Chunk } from '~/lib/chunkManager';
import ConfirmationDialog from './ConfirmationDialog';

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
        <div className="w-4/5 m-4 min-w-80 h-7/10 bg-gray-100 rounded-lg shadow-lg">
            {/* Header with navigation buttons */}
            <NavigationHeader 
                selectedWeekOffset={selectedWeekOffset} 
                setSelectedWeekOffset={setSelectedWeekOffset} 
            />

            {/* Days of the week */}
            <div className="flex h-11/12 flex-row items-center justify-between p-4">
                {getDaysOfWeek(selectedWeekOffset).map((day, index) => (
                    <DayOfWeek key={day.getTime()} day={day} />
                ))}
            </div>
        </div>
    );
}


function NavigationHeader({ selectedWeekOffset, setSelectedWeekOffset }: { selectedWeekOffset: number, setSelectedWeekOffset: (offset: number) => void }) {
    return (
        <div className="h-1/12 rounded-tl-lg rounded-tr-lg flex flex-col items-center flex-row justify-end pt-4 pl-4 pr-4 gap-2">
            <Button onClick={() => setSelectedWeekOffset(0)} variant="outline" className="h-12 text-xl">
                Today
            </Button>
            <Button onClick={() => setSelectedWeekOffset(selectedWeekOffset - 1)} variant="outline" size="icon" className="size-12">
                <MoveLeft />
            </Button>
            <Button onClick={() => setSelectedWeekOffset(selectedWeekOffset + 1)} variant="outline" size="icon" className="size-12">
                <MoveRight />
            </Button>             
        </div>
    )
}

function DayOfWeek({ day }: { day: Date }) {
    return (
        <div className="bg-white rounded-lg shadow w-1/7 m-1 h-full">
            <DayOfWeekHeader day={day} />
            <DayOfWeekChunks day={day} />
        </div>
    );
};

function DayOfWeekHeader({ day }: { day: Date }) {
    return (
        <div className={`h-1/9 rounded-tl-lg rounded-tr-lg flex flex-col items-center m-0 ${day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() ? "bg-blue-300" : ""}`}>
            <div className="flex flex-col items-center justify-center h-full">
                <span className="text-lg font-semibold">{day.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                <span className="text-sm text-gray-600">{day.toLocaleDateString()}</span>
            </div>
            <Separator variant="dashed" />
        </div>
    );
}

function DayOfWeekChunks({ day }: { day: Date }) {
    const { tasks, completedChunks } = useTaskManager();
    const chunks = makeChunks(tasks, completedChunks);

    day.setHours(0, 0, 0, 0); // Normalize the date to midnight for comparison

    return (
        <>
            {chunks.filter(chunk => {
                const chunkDate = new Date(chunk.date);
                return chunkDate.getTime() === day.getTime();
            }).map(chunk => (
                <ChunkBlock key={chunk.task.id} chunk={chunk} chunkHeight={
                    (chunk.durationMinutes /
                        chunks
                            .filter(c => {
                                const chunkDate = new Date(c.date);
                                return chunkDate.getTime() === day.getTime();
                            })
                            .reduce((sum, c) => sum + c.durationMinutes, 0)
                    ) * 100 * (8/9) // 8/9 to account for header height
                }/>
            ))
            }
        </>
    );
}

function ChunkBlock({ chunk, chunkHeight }: { chunk: Chunk, chunkHeight: number}) {
    const { completeChunk } = useTaskManager();

    return (
        <div
            style={{
                height: `${chunkHeight}%`,
                backgroundColor: chunk.task.colorHex,
                boxShadow: `0 0 0 2px ${chunk.task.colorHex}80`
            }}
            className={`w-full group rounded-lg flex flex-col p-2 relative`}
        >
            <div className="flex-1 flex items-center justify-center flex-col">
                <div>
                    {chunk.task.title}
                </div>
                <div className="flex w-full justify-center items-center flex-col">
                    {Math.floor(chunk.durationMinutes / 60).toString().padStart(2, "0")}:{(chunk.durationMinutes % 60).toString().padStart(2, "0")}
                </div>
            </div>
            <ConfirmationDialog title="Mark as Complete" description="Mark this chunk of your task as complete"  onConfirm={() => {
                completeChunk(chunk);
            }}>
                <Button
                    variant="secondary"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-full"
                >
                    Done
                </Button>
            </ConfirmationDialog>
        </div>
    );
}