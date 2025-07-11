import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Scale, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { WeightEntry } from '@/types';

interface WeightEntryFormProps {
  onSubmit: (data: Omit<WeightEntry, 'id' | 'userId'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<WeightEntry>;
  isLoading?: boolean;
}

const WeightEntryForm: React.FC<WeightEntryFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  const [weight, setWeight] = useState(initialData?.weight?.toString() || '');
  const [date, setDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : new Date()
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!weight || parseFloat(weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }

    if (!date) {
      newErrors.date = 'Please select a date';
    }

    if (date && date > new Date()) {
      newErrors.date = 'Date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        weight: parseFloat(weight),
        date: date ? format(date, 'yyyy-MM-dd') : undefined,
        notes: notes.trim() || undefined,
      });
    } catch (error) {
      console.error('Error submitting weight entry:', error);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Weight Input */}
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-medium text-foreground">
            Weight (lbs)
          </Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            min="0"
            max="1000"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter your weight"
            className={cn(
              "transition-colors",
              errors.weight && "border-destructive focus:border-destructive"
            )}
            disabled={isLoading}
          />
          {errors.weight && (
            <p className="text-sm text-destructive">{errors.weight}</p>
          )}
        </div>

        {/* Date Picker */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  errors.date && "border-destructive focus:border-destructive"
                )}
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-sm text-destructive">{errors.date}</p>
          )}
        </div>

        {/* Notes Input */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium text-foreground">
            Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about your weight entry..."
            className="min-h-[80px] resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : initialData ? 'Update' : 'Log Weight'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WeightEntryForm; 