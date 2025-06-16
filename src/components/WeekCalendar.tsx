"use client";

import React, { useState } from 'react';
import useScreenSize from '~/lib/useScreenSize';
import { Separator } from '@ui/separator';
import { Button } from './ui/button';
import { MoveLeft, MoveRight } from 'lucide-react';

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
        <div className="w-2/3 min-w-80 h-7/10 bg-gray-100 rounded-lg shadow-lg">
            {/* Header with navigation buttons */}
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

            {/* Days of the week */}
            <div className="flex h-11/12 flex-row items-center justify-between p-4">
                {getDaysOfWeek(selectedWeekOffset).map((day, index) => (
                    <div key={day.getTime()} className="bg-white rounded-lg shadow w-1/7 m-1 h-full">
                        <div className={`h-1/9 rounded-tl-lg rounded-tr-lg flex flex-col items-center m-0 ${day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() ? "bg-blue-300" : ""}`}>
                            <div className="flex flex-col items-center justify-center h-full">
                                <span className="text-lg font-semibold">{day.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                                <span className="text-sm text-gray-600">{day.toLocaleDateString()}</span>
                            </div>
                            <Separator variant="dashed" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}