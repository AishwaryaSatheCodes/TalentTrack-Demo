import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

export default function TableHeading({
    name,
    sortable = true,
    sort_field = null,
    sort_direction = null,
    children,
    sortChanged = () => { },
}) {

    return (
        <th onClick={e => sortChanged(name)} >
            <div className="px-3 py-3 gap-1 cursor-pointer flex items-center justify-between">
                {children}
                {sortable && (
                    <div>
                        <ChevronUpIcon className={
                            "w-4 " +
                            (sort_field === name &&
                                sort_direction === 'asc' ?
                                'text-white' : '')
                        } />

                        <ChevronDownIcon className={
                            "w-4 " +
                            (sort_field === name &&
                                sort_direction === 'desc' ?
                                'text-white' : '')
                        } />
                    </div>
                )}

            </div>
        </th >
    )
}