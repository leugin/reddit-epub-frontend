
const erroToMsj =(err: {data: any, status: number}) => {
    if(err.data && typeof err.data.message === 'string'){
        return err.data.message
    } else  if (Array.isArray(err.data.message)){
        return err.data.message[0]
    }
    else {
        return  'Por favor intenten de nuevo '
    }
}

export {
    erroToMsj
}
