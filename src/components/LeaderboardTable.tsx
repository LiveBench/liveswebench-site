type ToolScores = {
    tool: {
        name: string;
        website: string;
    }
    agent: number | null;
    edit: number | null;
    autocomplete: number | null;
}

const SCORE_COLUMNS = ['agent', 'edit', 'autocomplete'];

const globalAverage = (scores: (number | null)[]) => {
    const validScores = scores.filter((score) => score !== null);
    return validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
}

const formatPercentage = (percentage: number) => {
    return (percentage * 100).toFixed(2);
}

type LeaderboardTableProps = {
    data: ToolScores[];
    sortBy: string | undefined;
    sortDirection: string | undefined;
    filterColumns: string[] | undefined;
    updateSortBy: (column: string) => void;
    updateSortDirection: (direction: string) => void;
}

const LeaderboardTable = ({ data, sortBy, sortDirection, filterColumns, updateSortBy, updateSortDirection }: LeaderboardTableProps) => {

    const validData = data.filter((item) => {
        if (sortBy === 'global' || sortBy === '' || sortBy === undefined) {
            return true;
        }
        return item[sortBy as keyof ToolScores] !== null;
    });

    const columns = filterColumns ? SCORE_COLUMNS.filter((column) => filterColumns.includes(column)) : SCORE_COLUMNS;

    const sortedData = validData.sort((a, b) => {
        if (sortBy === 'name') {
            const sortValue = a.tool.name.localeCompare(b.tool.name);
            return sortDirection === 'asc' ? sortValue : -sortValue;
        }
        if (sortBy === 'global') {
            const globalAverageA = globalAverage(columns.map((column) => a[column as keyof ToolScores] as number | null));
            const globalAverageB = globalAverage(columns.map((column) => b[column as keyof ToolScores] as number | null));
            return sortDirection === 'asc' ? globalAverageA - globalAverageB : globalAverageB - globalAverageA;
        }
        const valueA = a[sortBy as keyof ToolScores]!;
        const valueB = b[sortBy as keyof ToolScores]!;

        if (sortDirection === 'asc') {
            return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        } else {
            return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
    });    
    
    const handleColumnClick = (column: string) => {
        if (sortBy === column) {
            updateSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            updateSortBy(column);
            updateSortDirection('desc');
        }
    };

    const getSortIndicator = (column: string) => {
        if (sortBy !== column) return null;
        return sortDirection === 'asc' 
            ? <span className="inline-block align-middle">▲</span> 
            : <span className="inline-block align-middle">▼</span>;
    };
    
    return (
        <div className="overflow-x-hidden max-h-[80vh] w-full">
            <div className="overflow-x-auto">
                <table className="text-center border-collapse table-auto">
                    <thead className="sticky top-0 z-10 bg-white">
                        <tr>
                            <th 
                                onClick={() => handleColumnClick('name')}
                                className="cursor-pointer sticky left-0 z-20 bg-white px-3 hover:bg-gray-100"
                            >
                                <div className="flex items-center justify-center">
                                    Tool {getSortIndicator('name')}
                                </div>
                            </th>
                            <th 
                                onClick={() => handleColumnClick('global')}
                                className="cursor-pointer px-3 hover:bg-gray-100"
                            >
                                <div className="flex items-center justify-center">
                                    Average {getSortIndicator('global')}
                                </div>
                            </th>
                            {columns.map((column) => (
                                <th 
                                    key={column} 
                                    className="capitalize cursor-pointer px-3 hover:bg-gray-100"
                                    onClick={() => handleColumnClick(column)}
                                >
                                    <div className="flex items-center justify-center px-2">
                                        {column.replace('_', ' ')} % Resolved {getSortIndicator(column)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((item) => (
                            <tr key={item.tool.name}>
                                <td className="sticky left-0 z-10 bg-white px-2"><a href={item.tool.website} target="_blank" rel="noopener noreferrer" className="no-underline">{item.tool.name}{item.tool.name == 'Github Copilot' ? '*' : ''}</a></td>
                                <td className="px-2">{formatPercentage(globalAverage(columns.map((column) => item[column as keyof ToolScores] as number | null)))}</td>
                                {columns.map((column: typeof SCORE_COLUMNS[number]) => (
                                    <td key={column} className="px-2">{item[column as keyof ToolScores] ? formatPercentage(item[column as keyof ToolScores] as number) : 'N/A'}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LeaderboardTable;