import React, { useState, useEffect } from 'react'
import InputField from '../../UI/InputField'
import { get, post } from '../../../utility/fetch'
import Pagination from '../../UI/Pagination'
import CategoriesTable from '../../tables/CategoriesTable'

function Settings() {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);


    const fetchData = async (page, size) => {
        setIsLoading(true)
        try {
            const response = await get(`/category/list/${page}/${size}/`)
            setData(response.resultList)
            console.log(response)
        } catch (e) {
            console.log(e)
        }
        setIsLoading(false)
    }

    const addCategory = async () => {
        try {
            const response = await post(`/category`)
            console.log(response)
        } catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {
        fetchData(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div><div className='flex gap-16'>
            <div className='w-100'>
                <CategoriesTable data={data} isloading={isLoading} />
                <div className='flex flex-h-end m-t-20'>
                    <Pagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

        </div></div>
    )
}

export default Settings