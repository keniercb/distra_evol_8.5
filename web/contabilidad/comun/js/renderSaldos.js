	
function verificaDecimales(component) {
    var v = component.getValue();
    v = v.toString()
    var pos = v.indexOf(".");
    if(pos!=-1)
    {
        temp = v.split('.');
        var strlen = temp[1].length;
        if(strlen>2) {
            component.markInvalid('El campo s&oacute;lo debe tener 2 decimales.');
            component.isValid(false);
            return false;
        }
        return true;		
    }else return true;
}


function saldo(v) { // Sin redondeo
    if (isNaN(v))return '0.00';
    v = (v < 0) ? v * (-1) : v;
    var x = v.toString()
    var pos = x.indexOf(".");
    if(pos!=-1)
    {
        var temp = x.split('.');
        var strlen = temp[1].length;
        v = v*1.0;	
        if(strlen>2)return v.toFixed(2);
        else return parseFloat(v).toFixed(2);		 
    } else {
        v=v*1.0; 
        return v.toFixed(2);
    }
}
	
	
function saldoformateado(n)
{
    if (isNaN(n))return '0.00';
    if(parseFloat(n) < 0) 
    {
        x = saldo(n);
        return '('+x.toString()+')';  
    }else return saldo(n);
}	
	
function saldounformat(n)
{ 
    n = n.toString();
    var pos = n.indexOf('('); // si viene con el parentesis (
    if(pos!=-1)
    {
        var t = n.substring(1,n.length-1);  //devuelve el elemento en la posicion 1 hasta penultima
        t = parseFloat(t);
        return t.toFixed(2); 
    } else 
{
        n=n*1.0; 
        return n.toFixed(2);
    }
}

function formatnegativo(n)
{
    n = n.toString();
    var pos = n.indexOf('('); // si viene con el parentesis (
    if(pos!=-1) return true; 
    else return false;
}
	

function conviertFecha(f)
{
    if (f=='') return '' ;  
    var pos = f.indexOf('/'); // si viene con el formato de la fecha
    if(pos!=-1) return f; 	  
    f=f.split('-');
    var result = f[2]+'/'+f[1]+'/'+f[0];
    return result;
}
	
