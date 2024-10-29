import ArticlesTable from "@/components/dashboard/articlesTable"

const ArticlesPage = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-6xl px-4">
                <ArticlesTable />
            </div>
        </div>
    )
}

export default ArticlesPage