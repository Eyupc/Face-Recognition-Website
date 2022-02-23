import React from "react";
import NavBar from "../static-parts/NavBar";

export class AddUserPage extends React.Component {

    constructor(props={}){
        super(props)
    }

    state = {
        files: []
      }
    
      fileSelectedHandler = (e:any) => {
        this.setState({ files: [...this.state.files, ...e.target.files] })
        console.log(this.state.files)
      }
    render(){
        return(<div className="flex flex-col justify-center items-center h-full sm:h-screen">
        <div className="md:flex box-border h-72 w-auto h-auto p-4 border-4 bg-slate-200	-500 m4 rounded">
            <div className="flex-1 h-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
            <div className="flex flex-col md:flex-col">
                  <NavBar/>
                  <div className="mb-4 p-4">
<div className="md:flex md:items-center mb-6">
    <div className="md:w-1/3">
      <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="Name">
        Name:
      </label>
    </div>
<div className="md:w-2/3">
<input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-200" id="Name"  
type="text" name="Name" required/>
</div></div>

<div className="md:flex md:items-center mb-6">
    <div className="md:w-1/3">
      <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="Lastname">
        Lastname: 
      </label>
    </div>
<div className="md:w-2/3">
<input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-200" id="Lastname"  
type="text" name="Lastname" required/>
</div></div>

<div className="md:flex md:items-center mb-6">
    <div className="md:w-1/3">
      <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="Age">
        Age:
      </label>
    </div>
    <div className="md:w-2/3">
<input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-200" id="Age"  
type="number" min="1" name="Age" required/>
</div></div>
<div className="md:flex md:items-center mb-6">
    <div className="md:w-1/3">
      <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="Fotos">
        Foto's:
      </label>
    </div>
<div className="md:w-2/3">
<form>
        <input type="file" multiple onChange={this.fileSelectedHandler} />
      </form>

</div></div>

  <div className="md:flex md:items-center mb-6">
<div className="md:w-1/3"></div>
<input style={{cursor:"pointer"}} className="w-64 h-10 px-5 m-2 text-pink-100 transition-colors duration-150 bg-pink-700 rounded-lg focus:shadow-outline hover:bg-pink-800" type="submit" value="Verander!"/>
</div></div>
                      </div>
                  </div></div></div>
        )
    }
}