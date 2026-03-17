import { SimuladoHistoryItem } from '../../types/history';
import { HistoryItemCard } from './HistoryItemCard';

interface HistoryListProps {
  records: SimuladoHistoryItem[];
}

export function HistoryList({ records }: HistoryListProps) {
  return (
    <div className="space-y-3">
      {records.map((record, index) => (
        <HistoryItemCard 
          key={record.id} 
          record={record} 
          index={index} 
        />
      ))}
    </div>
  );
}
