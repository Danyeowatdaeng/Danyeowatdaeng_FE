import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRangeCalendarProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  className?: string;
}

export default function DateRangeCalendar({ 
  onDateRangeChange, 
  className = "" 
}: DateRangeCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // 이번 달의 첫 번째 날과 마지막 날
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();

  // 달력에 표시할 날짜들 생성
  const daysInMonth = lastDay.getDate();
  const days = [];

  // 이전 달의 마지막 날들 (빈 칸 채우기)
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i);
    days.push({ date: prevDate, isCurrentMonth: false });
  }

  // 이번 달의 날짜들
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({ date, isCurrentMonth: true });
  }

  // 다음 달의 첫 번째 날들 (빈 칸 채우기)
  const remainingDays = 42 - days.length; // 6주 * 7일 = 42
  for (let day = 1; day <= remainingDays; day++) {
    const nextDate = new Date(year, month + 1, day);
    days.push({ date: nextDate, isCurrentMonth: false });
  }

  const handleDateClick = (date: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // 시작 날짜 선택 또는 리셋
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      onDateRangeChange(date, null);
    } else if (selectedStartDate && !selectedEndDate) {
      // 종료 날짜 선택
      if (date < selectedStartDate) {
        // 종료 날짜가 시작 날짜보다 이전이면 순서 바꿈
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
        onDateRangeChange(date, selectedStartDate);
      } else {
        setSelectedEndDate(date);
        onDateRangeChange(selectedStartDate, date);
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isDateSelected = (date: Date) => {
    return (selectedStartDate && date.getTime() === selectedStartDate.getTime()) ||
           (selectedEndDate && date.getTime() === selectedEndDate.getTime());
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1));
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date) => {
    return date < today && !isToday(date);
  };

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold">
          {year}년 {monthNames[month]}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = day.isCurrentMonth;
          const isSelected = isDateSelected(day.date);
          const isInRange = isDateInRange(day.date);
          const isTodayDate = isToday(day.date);
          const isPast = isPastDate(day.date);

          return (
            <button
              key={index}
              onClick={() => !isPast && handleDateClick(day.date)}
              disabled={isPast}
              className={`
                h-8 w-8 text-sm rounded-full flex items-center justify-center
                ${!isCurrentMonth ? 'text-gray-300' : ''}
                ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                ${isSelected ? 'bg-orange-500 text-white' : ''}
                ${isInRange && !isSelected ? 'bg-orange-100' : ''}
                ${isTodayDate && !isSelected ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
              `}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>

      {/* 선택된 날짜 범위 표시 */}
      {(selectedStartDate || selectedEndDate) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            {selectedStartDate && (
              <div>시작: {selectedStartDate.toLocaleDateString('ko-KR')}</div>
            )}
            {selectedEndDate && (
              <div>종료: {selectedEndDate.toLocaleDateString('ko-KR')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
