/* eslint-disable no-undef */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TaskManager from './index';

global.fetch = vi.fn();

describe('TaskManager', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, title: 'Task 1', status: 'todo', priority: 'low', dueDate: '2023-12-31' },
        { id: 2, title: 'Task 2', status: 'in_progress', priority: 'medium', dueDate: '2023-12-30' },
        { id: 3, title: 'Task 3', status: 'done', priority: 'high', dueDate: '2023-12-29' },
      ]),
    });
  });

  it('renders without crashing', async () => {
    render(<TaskManager />);
    await waitFor(() => expect(screen.getByText('Task Manager')).toBeInTheDocument());
  });


  it('allows sorting tasks', async () => {
    render(<TaskManager />);
    await waitFor(() => expect(screen.getByText('Task 1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Sort'));
    fireEvent.click(screen.getByText('Due Date'));

    const tasks = screen.getAllByRole('listitem');
    expect(tasks[0]).toHaveTextContent('Task 3');
    expect(tasks[1]).toHaveTextContent('Task 2');
    expect(tasks[2]).toHaveTextContent('Task 1');
  });

  it('allows filtering tasks by status', async () => {
    render(<TaskManager />);
    await waitFor(() => expect(screen.getByText('Task 1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Status'));
    fireEvent.click(screen.getByText('Progress'));

    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
  });

  it('changes active tab', async () => {
    render(<TaskManager />);
    await waitFor(() => expect(screen.getByText('Task Manager')).toBeInTheDocument());

    // Assuming TaskSidebar renders these tab buttons
    fireEvent.click(screen.getByText('Kanban Board'));
    expect(screen.getByText('Kanban Board Tasks')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Completed'));
    expect(screen.getByText('Completed Tasks')).toBeInTheDocument();

    fireEvent.click(screen.getByText("User's Task"));
    expect(screen.getByText('Users Tasks')).toBeInTheDocument();
  });
});