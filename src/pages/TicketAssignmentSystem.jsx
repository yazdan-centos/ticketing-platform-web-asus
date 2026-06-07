import React, { useState, useMemo } from 'react';

// Enum simulation matching: com.mapnaom.ticketingplatform.model.enums.TicketStatus
const TicketStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
};

// Mock Team Members for lookup logic
const TEAM_MEMBERS = [
  { id: 101, name: 'Sarah Jenkins', role: 'Support Lead', avatar: '👩‍💻' },
  { id: 102, name: 'Alex Rivera', role: 'Technical Support', avatar: '👨‍💻' },
  { id: 103, name: 'David Kim', role: 'Billing Specialist', avatar: '🧑‍💼' },
  { id: 104, name: 'Emma Watson', role: 'Customer Success', avatar: '👩‍💼' },
];

// Mock Data strictly following com.mapnaom.ticketingplatform.dto.ticket.TicketSummaryResponse
const SERVER_MOCK_TICKETS = [
  { id: 1, title: "Can't add product to cart", status: TicketStatus.OPEN, customerId: 5001, assignedMemberId: null, createdAt: "2026-06-05T10:15:30" },
  { id: 2, title: "Payment gateway timeout error", status: TicketStatus.IN_PROGRESS, customerId: 5002, assignedMemberId: 102, createdAt: "2026-06-06T14:22:10" },
  { id: 3, title: "Request for invoice copy", status: TicketStatus.RESOLVED, customerId: 5003, assignedMemberId: 103, createdAt: "2026-06-04T09:00:00" },
  { id: 4, title: "Mobile app crashes on login", status: TicketStatus.OPEN, customerId: 5004, assignedMemberId: null, createdAt: "2026-06-07T08:30:15" },
  { id: 5, title: "GDPR data deletion request", status: TicketStatus.CLOSED, customerId: 5005, assignedMemberId: 101, createdAt: "2026-06-01T11:45:00" },
];

export default function TicketAssignmentDashboard() {
  const [tickets, setTickets] = useState(SERVER_MOCK_TICKETS);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Search state variables
  const [searchTitle, setSearchTitle] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  // Sorting state variables
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  // Handle assignment state change
  const handleAssign = (ticketId, memberId) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId ? { ...ticket, assignedMemberId: memberId } : ticket
      )
    );
    setActiveDropdown(null);
  };

  // Handle sort trigger
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Process sorting logic cleanly
  const sortedAndFilteredTickets = useMemo(() => {
    let result = [...tickets];

    // 1. Apply Multi-column Filters
    if (searchTitle.trim() !== '') {
      result = result.filter(t => t.title.toLowerCase().includes(searchTitle.toLowerCase()));
    }
    if (searchStatus !== '') {
      result = result.filter(t => t.status === searchStatus);
    }

    // 2. Apply Sort Configuration
    if (sortConfig.key !== null) {
      result.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        // Resolve member name text if sorting by team member column
        if (sortConfig.key === 'assignedMemberId') {
          const memberA = TEAM_MEMBERS.find(m => m.id === a.assignedMemberId);
          const memberB = TEAM_MEMBERS.find(m => m.id === b.assignedMemberId);
          valA = memberA ? memberA.name : '';
          valB = memberB ? memberB.name : '';
        }

        if (valA === null || valA === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valB === null || valB === undefined) return sortConfig.direction === 'asc' ? 1 : -1;

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [tickets, searchTitle, searchStatus, sortConfig]);

  // Visual helper indicator for column headers
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return ' ↕️';
    return sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽';
  };

  // Formatting date string nicely
  const formatDate = (isoString) => {
    return isoString.replace('T', ' ').substring(0, 16);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Ticketing Platform Board</h2>

      {/* Search and Filters Section */}
      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="🔍 Filter by Title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          style={styles.selectInput}
        >
          <option value="">All Statuses</option>
          {Object.values(TicketStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Main Table Presentation */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.thRow}>
            <th onClick={() => requestSort('id')} style={{ ...styles.th, cursor: 'pointer', width: '70px' }}>ID {getSortIndicator('id')}</th>
            <th onClick={() => requestSort('title')} style={{ ...styles.th, cursor: 'pointer' }}>TITLE {getSortIndicator('title')}</th>
            <th onClick={() => requestSort('status')} style={{ ...styles.th, cursor: 'pointer', width: '130px' }}>STATUS {getSortIndicator('status')}</th>
            <th onClick={() => requestSort('customerId')} style={{ ...styles.th, cursor: 'pointer', width: '120px' }}>CUST ID {getSortIndicator('customerId')}</th>
            <th onClick={() => requestSort('createdAt')} style={{ ...styles.th, cursor: 'pointer', width: '150px' }}>CREATED AT {getSortIndicator('createdAt')}</th>
            <th onClick={() => requestSort('assignedMemberId')} style={{ ...styles.th, cursor: 'pointer', width: '200px' }}>ASSIGNEE {getSortIndicator('assignedMemberId')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedAndFilteredTickets.map(ticket => {
            const currentAssignee = TEAM_MEMBERS.find(m => m.id === ticket.assignedMemberId);

            return (
              <tr key={ticket.id} style={styles.tr}>
                <td style={styles.tdId}>{ticket.id}</td>
                <td style={styles.tdTitle}>{ticket.title}</td>
                <td>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor:
                      ticket.status === 'OPEN' ? '#2563eb' :
                        ticket.status === 'IN_PROGRESS' ? '#eab308' :
                          ticket.status === 'RESOLVED' ? '#10b981' : '#6b7280'
                  }}>
                    {ticket.status}
                  </span>
                </td>
                <td style={styles.tdMetadata}>{ticket.customerId}</td>
                <td style={styles.tdMetadata}>{formatDate(ticket.createdAt)}</td>
                <td style={styles.tdAssignee}>
                  <div style={styles.assigneeContainer}>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === ticket.id ? null : ticket.id)}
                      style={styles.assignButton}
                    >
                      {currentAssignee ? (
                        <>
                          <span>{currentAssignee.avatar}</span>
                          <span>{currentAssignee.name}</span>
                        </>
                      ) : (
                        <span style={styles.unassigned}>Unassigned ➕</span>
                      )}
                    </button>

                    {activeDropdown === ticket.id && (
                      <div style={styles.dropdown}>
                        <div style={styles.dropdownHeader}>Assign Member</div>
                        {ticket.assignedMemberId && (
                          <div onClick={() => handleAssign(ticket.id, null)} style={styles.clearOption}>
                            ❌ Clear Assignee
                          </div>
                        )}
                        {TEAM_MEMBERS.map(member => (
                          <div
                            key={member.id}
                            onClick={() => handleAssign(ticket.id, member.id)}
                            style={{
                              ...styles.dropdownItem,
                              backgroundColor: ticket.assignedMemberId === member.id ? '#f3f4f6' : 'transparent'
                            }}
                          >
                            <span>{member.avatar}</span>
                            <div>
                              <div style={styles.memberName}>{member.name}</div>
                              <div style={styles.memberRole}>{member.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {sortedAndFilteredTickets.length === 0 && (
            <tr>
              <td colSpan="6" style={styles.noResults}>No matching records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'system-ui, sans-serif', padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', maxWidth: '1100px', margin: '20px auto' },
  header: { fontSize: '22px', color: '#1f2937', marginBottom: '20px', fontWeight: '600' },
  filterSection: { display: 'flex', gap: '12px', marginBottom: '20px' },
  electInput: { width: '180px', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', backgroundColor: '#fff' }, table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' }, thRow: { borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }, th: { padding: '14px 12px', fontSize: '12px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em', userSelect: 'none' }, tr: { borderBottom: '1px solid #f3f4f6', height: '60px', transition: 'background-color 0.2s' }, tdId: { padding: '12px', color: '#6b7280', fontSize: '14px' }, tdTitle: { padding: '12px', fontWeight: '500', color: '#111827', fontSize: '14px' }, tdMetadata: { padding: '12px', color: '#4b5563', fontSize: '13px' }, statusBadge: { color: '#ffffff', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', display: 'inline-block' }, tdAssignee: { position: 'relative' }, assigneeContainer: { position: 'relative', display: 'inline-block' }, assignButton: { display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#374151', minWidth: '150px', justifyContent: 'flex-start' }, unassigned: { color: '#9ca3af', fontStyle: 'italic' }, dropdown: { position: 'absolute', top: '110%', right: '0', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 10, width: '230px', padding: '6px 0' }, dropdownHeader: { padding: '8px 12px', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '700', borderBottom: '1px solid #f3f4f6' }, dropdownItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', cursor: 'pointer' }, clearOption: { padding: '8px 12px', fontSize: '13px', color: '#ef4444', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontWeight: '500' }, memberName: { fontSize: '13px', fontWeight: '500', color: '#111827' }, memberRole: { fontSize: '11px', color: '#6b7280' }, noResults: { padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }
};