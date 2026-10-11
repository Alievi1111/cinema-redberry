import type { TicketFilter } from '../../types/tickets.types';

interface TicketsTabsProps {
  activeTab: TicketFilter;
  onChange: (tab: TicketFilter) => void;
  upcomingCount: number;
  pastCount: number;
}

const TicketsTabs = ({
  activeTab,
  onChange,
  upcomingCount,
  pastCount,
}: TicketsTabsProps) => {
  const tabs = [
    {
      label: 'Upcoming',
      value: 'upcoming',
      count: upcomingCount,
    },
    {
      label: 'Past',
      value: 'past',
      count: pastCount,
    },
  ] as const;

  return (
    <div
      role="tablist"
      aria-label="Ticket categories"
      className="flex items-center bg-[#1E2031] p-[5px] rounded-[12px] w-fit h-[39px]"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            id={`tickets-tab-${tab.value}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="tickets-panel"
            onClick={() => onChange(tab.value)}
            className={`flex h-full items-center gap-[8px] rounded-[10px] px-[9px] text-[14px] font-semibold transition-colors duration-200 cursor-pointer ${
              isActive
                ? 'bg-[#2A2C3D] text-white'
                : 'text-[#A9A9A9] hover:text-white'
            }`}
          >
            {tab.label}

            <span className={isActive ? 'text-white' : 'text-[#505261]'}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TicketsTabs;
