// Code skeleton

// import { useState, useEffect } from "react"

// export function useLocalStorage(key, defaultValue) {

//   const [value, setValue] = useState(() => {
//     // 1. try to read from localStorage here
//     // 2. if something exists, parse it with JSON.parse and return it
//     // 3. if nothing exists (null), return defaultValue
//     // 4. if it errors, return defaultValue
//   })

//   useEffect(() => {
//     // save value to localStorage whenever it changes
//     // use JSON.stringify because localStorage only stores strings
//   }, [key, value])

//   // return exactly like useState does
//   return [value, setValue]
// }
import { useState,useEffect } from "react";

export function useLocalStorage(key, defaultValues){
  const [value, setValue] = useState(() =>{
    try{
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValues;
    }
    catch(err){
      console.error("Could not read value: ", err);
      return defaultValues;
    }

  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  },[key,value]);
  return ([value , setValue]);
}