import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
}

export const Calendar = ({ selectedDate, onDateSelect }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === new Date().toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth('prev')}
          className="h-8 w-8 hover:bg-primary/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-lg font-semibold text-foreground">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth('next')}
          className="h-8 w-8 hover:bg-primary/10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <button
            key={index}
            onClick={() => date && onDateSelect(date)}
            disabled={!date}
            className={`
              h-10 flex items-center justify-center text-sm rounded-lg transition-smooth
              ${!date ? 'invisible' : 'hover:bg-primary/10'}
              ${isDateSelected(date) 
                ? 'bg-gradient-primary text-primary-foreground shadow-soft' 
                : isToday(date)
                ? 'bg-accent/20 text-accent-foreground font-semibold'
                : 'text-foreground'
              }
            `}
          >
            {date?.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};