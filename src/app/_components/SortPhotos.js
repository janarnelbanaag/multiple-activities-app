export default function SortPhotos({ onSort }) {
    return (
        <div className="flex items-center gap-2 w-full md:w-auto ml-auto">
            <label className="text-gray-700">Sort by:</label>
            <select
                onChange={(e) => onSort(e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
                <option value="created_at">Upload Date</option>
                <option value="photo_name">Photo Name</option>
            </select>
        </div>
    );
}
