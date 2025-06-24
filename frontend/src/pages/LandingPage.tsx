import { useNavigate } from "react-router-dom"

export const Landing=()=>{
   const navigate=useNavigate();

    return <div className=" bg-gradient-to-r from-gray-800 to-gray-900 h-screen max-h-full flex flex-col items-center justify-center w-screen max-w-full">
       
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-xl  ">
                <div className=" flex items-center justify-center mb-10 mt-10">
                   <div className="w-100 h-100 md:mt-40 md:mb-40  border-white border-4">
                     <img src="/chessboard.png" alt=""  className="h-80 w-80"/>
                   </div>
                </div>

                <div className="flex flex-col  justify-center items-center ">
                    <div className=" md:m-12 flex flex-col  justify-center items-center">
                       <h1 className="text-4xl font-bold text-slate-200 text-center">
                        Play Chess Online on the #2 Site!
                       </h1>
                    </div>

                    <div className="m-10 md:m-12 ">
                        <button 
                        onClick={()=>navigate("/game")}
                        className="bg-blue-500 rounded-md shadow-white shadow-md ">
                           <div className="flex items-center justify-center m-2">
                             <div>
                                <img src="/handPicking.png " alt=""  className="h-8 w-8"/>
                            </div>
                            <div className="text-white font-bold text-lg">
                                Play Online
                            </div>
                           </div>
                        </button>
                    </div>
                </div>
           
        </div>
    </div>
}