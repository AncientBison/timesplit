"use client";

import type { Chunk } from '~/lib/chunkManager';
import { ChunkBlock } from './WeekCalendar';
import useTaskManager from '~/lib/useTaskManager';

export default function CompletedChunksDisplay() {
  const { completedChunks } = useTaskManager();

  const getSortedColumnChunks = () => {
    const columnHeights: number[] = [0, 0, 0, 0, 0, 0, 0];
    const columnChunks: Chunk[][] = [[] as Chunk[], [] as Chunk[], [] as Chunk[], [] as Chunk[], [] as Chunk[], [] as Chunk[], [] as Chunk[]];

    for (const completedChunk of completedChunks.sort((a, b) => (a.date.getTime() - b.date.getTime()))) {

      const shortestColumnIndex = columnHeights.reduce((minIndex, height, index) => 
          height < columnHeights[minIndex]! ? index : minIndex, 0);

      columnChunks[shortestColumnIndex]!.push(completedChunk);
      columnHeights[shortestColumnIndex]! += completedChunk.durationMinutes;
    }

    return columnChunks;
  }

  return (
    <>
      {completedChunks.length > 0 && (
        <div className="flex flex-col w-full justify-center items-center gap-16">
          <h1 className="text-4xl">
            Your Completed Chunks
          </h1>
          <div className="w-4/5 m-4 min-w-80 border-gray-600 border-l-6 border-r-6 border-b-6 rounded-br-lg rounded-bl-lg flex">
            {getSortedColumnChunks().map((chunks, index) => (
              <div key={chunks[0]?.id ?? index} className="w-1/7 flex flex-col-reverse">
                {chunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    style={{ height: `${chunk.durationMinutes * 10}px` }}
                  >
                    <ChunkBlock chunk={chunk} complete chunkHeight={100} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}