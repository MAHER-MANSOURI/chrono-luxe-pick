import { useState } from "react";
import { Calendar } from "./Calendar";
import { TimePicker } from "./TimePicker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface DateTimeSelection {
  date: Date | null;
  startTime: string;
  endTime: string;
  duration: number;
}

export const DateTimePicker = () => {
  const [selection, setSelection] = useState<DateTimeSelection>({
    date: null,
    startTime: "12:00",
    endTime: "15:00",
    duration: 3
  });

  const [activeView, setActiveView] = useState<"date" | "time">("date");

  const handleDateSelect = (date: Date | null) => {
    setSelection(prev => ({ ...prev, date }));
  };

  const handleTimeSelect = (startTime: string, endTime: string, duration: number) => {
    setSelection(prev => ({ ...prev, startTime, endTime, duration }));
  };


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Schedule Meeting</h1>
          <p className="text-muted-foreground">Select your preferred date and time</p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeView === "date" ? "default" : "outline"}
            onClick={() => setActiveView("date")}
            className="flex-1"
          >
            Date
          </Button>
          <Button
            variant={activeView === "time" ? "default" : "outline"}
            onClick={() => setActiveView("time")}
            className="flex-1"
          >
            Time
          </Button>
        </div>

        {/* Content */}
        <Card className="bg-card/80 backdrop-blur-glass border-0 shadow-glass">
          {activeView === "date" ? (
            <Calendar selectedDate={selection.date} onDateSelect={handleDateSelect} />
          ) : (
            <TimePicker
              startTime={selection.startTime}
              endTime={selection.endTime}
              duration={selection.duration}
              onTimeSelect={handleTimeSelect}
            />
          )}
        </Card>


        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-gradient-primary hover:opacity-90 transition-smooth"
            disabled={!selection.date}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};