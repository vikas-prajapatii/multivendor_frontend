import React from 'react'
import { menLevelThree } from '../../../data/category/level three/menLevelThree'
import { menLevelTwo } from '../../../data/category/level two/menLevelTwo'
import { womenLevelThree } from '../../../data/category/level three/womenLevelThree'
import { womenLevelTwo } from '../../../data/category/level two/womenLevelTwo'
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { electronicsLevelTwo } from '../../../data/category/level two/electronicsLavelTwo'
import { furnitureLevelTwo } from '../../../data/category/level two/furnitureLevleTwo'
import { furnitureLevelThree } from '../../../data/category/level three/furnitureLevelThree'
import { electronicsLevelThree } from '../../../data/category/level three/electronicsLevelThree'

const categoryTwo: { [key: string]: any[] } = {

    men: menLevelTwo,
    women: womenLevelTwo,
    electronics:electronicsLevelTwo,
    home_furniture:furnitureLevelTwo,


}

const categoryThree: { [key: string]: any[] } = {
    men: menLevelThree,
    women: womenLevelThree,
    electronics:electronicsLevelThree,
    home_furniture:furnitureLevelThree,

}

const CategorySheet = ({ selectedCategory,toggleDrawer,setShowSheet }: any) => {

const navigate=useNavigate()


    const childCategory = (category: any, parentCategoryId: any) => {
        return category.filter((child: any) => {
            // console.log("Category", parentCategoryId, child)
            return child.parentCategoryId == parentCategoryId
        })

    }
    const handleCategoryClick = (category:string) => {
        if(toggleDrawer){
            toggleDrawer(false)()
        }
        if(setShowSheet){
            setShowSheet(false)
        }
        
        navigate("/products/"+category)
    }
    return (
        <Box className='bg-noir-card text-white border-b border-gray-800 shadow-lg lg:h-[500px] overflow-y-auto'>
            <div className=' flex text-sm flex-wrap'>
                {categoryTwo[selectedCategory]?.map((item: any,index) => 
                <div  key={item.name} className={`p-8 lg:w-[20%] ${index%2==0?"bg-neutral-900":"bg-noir-card"}`}>
 
                    <p className='text-[#C5A059] mb-5 font-semibold'>{item.name}</p>
 
                    <ul className='space-y-3'>
                        {childCategory(categoryThree[selectedCategory], item.categoryId)?.map((item: any) => <div key={item.name}>
 
                            <li 
                            onClick={()=>handleCategoryClick(item.categoryId)}
                            className='hover:text-[#C5A059] cursor-pointer text-gray-300 hover:text-white'>
                                {item.name}
                            </li>
 
                        </div>)}
                    </ul>
 
 
                </div>)}
            </div>
        </Box>
    )
}

export default CategorySheet