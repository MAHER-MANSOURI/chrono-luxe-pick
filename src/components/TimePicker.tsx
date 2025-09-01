import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface TimePickerProps {
  startTime: string;
  endTime: string;
  duration: number;
  onTimeSelect: (startTime: string, endTime: string, duration: number) => void;
}

export const TimePicker = ({ startTime, endTime, duration, onTimeSelect }: TimePickerProps) => {
  const [selectedStartTime, setSelectedStartTime] = useState(startTime);
  const [selectedEndTime, setSelectedEndTime] = useState(endTime);

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const displayHour = hour.toString().padStart(2, '0');
        const displayMinute = minute.toString().padStart(2, '0');
        const timeString = `${displayHour}:${displayMinute}`;
        times.push({
          value: timeString,
          hour,
          minute,
          totalMinutes: hour * 60 + minute
        });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const calculateDuration = (start: string, end: string) => {
    const startOption = timeOptions.find(t => t.value === start);
    const endOption = timeOptions.find(t => t.value === end);
    
    if (!startOption || !endOption) return 0;
    
    let diff = endOption.totalMinutes - startOption.totalMinutes;
    if (diff <= 0) diff += 24 * 60; // Handle next day
    
    return Math.round(diff / 60 * 2) / 2; // Round to nearest 0.5 hour
  };

  useEffect(() => {
    const newDuration = calculateDuration(selectedStartTime, selectedEndTime);
    onTimeSelect(selectedStartTime, selectedEndTime, newDuration);
  }, [selectedStartTime, selectedEndTime, onTimeSelect]);

  const CircularTimePicker = ({ 
    selected, 
    onSelect, 
    label 
  }: { 
    selected: string; 
    onSelect: (time: string) => void; 
    label: string;
  }) => {
    const radius = 100;
    const centerX = 120;
    const centerY = 120;

    const selectedIndex = timeOptions.findIndex(t => t.value === selected);
    const selectedAngle = (selectedIndex / timeOptions.length) * 2 * Math.PI - Math.PI / 2;

    const handleClick = (e: React.MouseEvent<SVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - centerX;
      const y = e.clientY - rect.top - centerY;
      const angle = Math.atan2(y, x) + Math.PI / 2;
      const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
      const index = Math.round((normalizedAngle / (2 * Math.PI)) * timeOptions.length) % timeOptions.length;
      onSelect(timeOptions[index].value);
    };

    return (
      <div className="flex flex-col items-center">
        <div className="text-sm font-medium text-muted-foreground mb-2">{label}</div>
        <div className="text-lg font-semibold text-foreground mb-4">{selected}</div>
        
        <svg 
          width="240" 
          height="240" 
          className="cursor-pointer"
          onClick={handleClick}
        >
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="2"
          />
          
          {/* Hour markers */}
          {[0, 3, 6, 9, 12, 15, 18, 21].map(hour => {
            const angle = (hour / 24) * 2 * Math.PI - Math.PI / 2;
            const x = centerX + (radius - 20) * Math.cos(angle);
            const y = centerY + (radius - 20) * Math.sin(angle);
            const displayHour = hour.toString().padStart(2, '0');
            
            return (
              <text
                key={hour}
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize="12"
                fill="hsl(var(--muted-foreground))"
                className="font-medium"
              >
                {displayHour}
              </text>
            );
          })}
          
          {/* Selected time indicator */}
          <circle
            cx={centerX + radius * Math.cos(selectedAngle)}
            cy={centerY + radius * Math.sin(selectedAngle)}
            r="8"
            fill="hsl(var(--primary))"
            className="drop-shadow-sm"
          />
          
          {/* Line from center to selected time */}
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + radius * Math.cos(selectedAngle)}
            y2={centerY + radius * Math.sin(selectedAngle)}
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            opacity="0.5"
          />
          
          {/* Center dot */}
          <circle
            cx={centerX}
            cy={centerY}
            r="4"
            fill="hsl(var(--primary))"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Select Duration & Time</h2>
        <div className="text-sm text-muted-foreground">
          {duration} hour{duration !== 1 ? 's' : ''} • Meeting Duration
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <CircularTimePicker
          selected={selectedStartTime}
          onSelect={setSelectedStartTime}
          label="Start Time"
        />
        <CircularTimePicker
          selected={selectedEndTime}
          onSelect={setSelectedEndTime}
          label="End Time"
        />
      </div>

      {/* Quick duration buttons */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-muted-foreground">Quick Duration</div>
        <div className="flex gap-2 flex-wrap">
          {[0.5, 1, 1.5, 2, 3, 4].map(hours => (
            <Button
              key={hours}
              variant={duration === hours ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const startOption = timeOptions.find(t => t.value === selectedStartTime);
                if (startOption) {
                  const endMinutes = startOption.totalMinutes + (hours * 60);
                  const endHour = Math.floor(endMinutes / 60) % 24;
                  const endMin = endMinutes % 60;
                  const endTimeString = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
                  setSelectedEndTime(endTimeString);
                }
              }}
              className="transition-smooth"
            >
              {hours}h
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};