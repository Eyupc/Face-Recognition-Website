import React from "react";
import "./css/index.css"
export class App extends React.Component {

    constructor(props = {}){
        super(props)
        //icons toevoegen!
    }
    render(){
        return(<div className="flex flex-col justify-center items-center h-screen">
        <div className="box-border h-72 w-auto h-auto p-4 border-4 bg-slate-200	-500 m4 rounded ">
            <div className="flex-1 h-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
                <div className="flex flex-col md:flex-row">
                    <div className="h-32 md:h-auto md:w-1/2">
                        <img className="object-cover w-full h-full" src="https://source.unsplash.com/user/erondu/1600x900"
                            alt="img" />
                    </div>
        <div className='flex items-center justify-center p-6 sm:p-12 md:w-1/2'>  
        <div className="w-full">      
        <div className="mb-6">
        <h2 className="flex justify-center text-2xl font-bold text-center text-gray-700">Admin Login</h2></div>
        <div className="mb-6">
        <label htmlFor="username" className="text-base font-normal">Username</label>
        <input className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600" 
        name="username" placeholder="Username" id="username" type="text"></input></div>
        <div className="mb-4">
        <label htmlFor="password" className="text-base font-normal">Password</label><br/>
        <input className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"  name="password" placeholder="Your password.." id="password" type="password"></input>
        </div></div>

</div>
            </div>
            </div></div></div>
        )
    }
}