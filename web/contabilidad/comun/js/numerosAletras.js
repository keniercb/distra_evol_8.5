

var importe_parcial, num_letras, parcial, car;
var cent = false;
function centimos()
{
    importe_parcial = number_format(importe_parcial, 2, ".", "") * 100;
    if (importe_parcial == '' && !cent)
        num_letras = (parcial == 1) ? "peso" : "pesos";
    else if (importe_parcial > 0) {
        //Este redondeo es nuevo
        importe_parcial = Math.round(importe_parcial);
        num_letras = ((parcial == 1) ? " peso con " : " pesos con ") + decena_centimos(parseInt(importe_parcial));
    }
    else
        num_letras = "";

    return num_letras;
}

function number_format(number, decimals, dec_point, thousands_sep) {
    var n = number, prec = decimals;
    n = !isFinite(+n) ? 0 : +n;
    prec = !isFinite(+prec) ? 0 : Math.abs(prec);
    var sep = (typeof thousands_sep == "undefined") ? ',' : thousands_sep;
    var dec = (typeof dec_point == "undefined") ? '.' : dec_point;

    var s = (prec > 0) ? n.toFixed(prec) : Math.round(n).toFixed(prec); //fix for IE parseFloat(0.55).toFixed(0) = 0;

    var abs = Math.abs(n).toFixed(prec);
    var _, i;

    if (abs >= 1000) {
        _ = abs.split(/\D/);
        i = _[0].length % 3 || 3;

        _[0] = s.slice(0, i + (n < 0)) +
                _[0].slice(i).replace(/(\d{3})/g, sep + '$1');

        s = _.join(dec);
    } else {
        s = s.replace('.', dec);
    }
 
    return s;
}

function unidad_centimos(numero)
{
    numero = Math.round(numero);
    switch (numero)
    {
        case 9:
            {
                num_letras = "nueve centavos";
                break;
            }
        case 8:
            {
                num_letras = "ocho centavos";
                break;
            }
        case 7:
            {
                num_letras = "siete centavos";
                break;
            }
        case 6:
            {
                num_letras = "seis centavos";
                break;
            }
        case 5:
            {
                num_letras = "cinco centavos";
                break;
            }
        case 4:
            {
                num_letras = "cuatro centavos";
                break;
            }
        case 3:
            {
                num_letras = "tres centavos";
                break;
            }
        case 2:
            {
                num_letras = "dos centavos";
                break;
            }
        case 1:
            {
                num_letras = "un centavo";
                break;
            }
    }
    return num_letras;
}

function decena_centimos(numero)
{
    if (numero >= 10)
    {
        if (numero >= 90 && numero <= 99)
        {
            if (numero == 90)
                return "noventa centavos";
            else if (numero == 91)
                return "noventa y un centavos";
            else
                return "noventa y " + unidad_centimos(numero - 90);
        }
        if (numero >= 80 && numero <= 89)
        {
            if (numero == 80)
                return "ochenta centavos";
            else if (numero == 81)
                return "ochenta y un centavos";
            else
                return "ochenta y " + unidad_centimos(numero - 80);
        }
        if (numero >= 70 && numero <= 79)
        {
            if (numero == 70)
                return "setenta centavos";
            else if (numero == 71)
                return "setenta y un centavos";
            else
                return "setenta y " + unidad_centimos(numero - 70);
        }
        if (numero >= 60 && numero <= 69)
        {
            if (numero == 60)
                return "sesenta centavos";
            else if (numero == 61)
                return "sesenta y un centavos";
            else
                return "sesenta y " + unidad_centimos(numero - 60);
        }
        if (numero >= 50 && numero <= 59)
        {
            if (numero == 50)
                return "cincuenta centavos";
            else if (numero == 51)
                return "cincuenta y un centavos";
            else
                return "cincuenta y " + unidad_centimos(numero - 50);
        }
        if (numero >= 40 && numero <= 49)
        {
            if (numero == 40)
                return "cuarenta centavos";
            else if (numero == 41)
                return "cuarenta y un centavos";
            else
                return "cuarenta y " + unidad_centimos(numero - 40);
        }
        if (numero >= 30 && numero <= 39)
        {
            if (numero == 30)
                return "treinta centavos";
            else if (numero == 91)
                return "treinta y un centavos";
            else
                return "treinta y " + unidad_centimos(numero - 30);
        }
        if (numero >= 20 && numero <= 29)
        {
            if (numero == 20)
                return "veinte centavos";
            else if (numero == 21)
                return "veintiun centavos";
            else
                return "veinti" + unidad_centimos(numero - 20);
        }
        if (numero >= 10 && numero <= 19)
        {
            if (numero == 10)
                return "diez centavos";
            else if (numero == 11)
                return "once centavos";
            else if (numero == 12)
                return "doce centavos";
            else if (numero == 13)
                return "trece centavos";
            else if (numero == 14)
                return "catorce centavos";
            else if (numero == 15)
                return "quince centavos";
            else if (numero == 16)
                return "dieciseis centavos";
            else if (numero == 17)
                return "diecisiete centavos";
            else if (numero == 18)
                return "dieciocho centavos";
            else if (numero == 19)
                return "diecinueve centavos";
        }
    }
    else
        return unidad_centimos(numero);
}

function unidad(numero)
{
    switch (parseInt(numero))
    {
        case 9:
            {
                num = "nueve ";
                break;
            }
        case 8:
            {
                num = "ocho ";
                break;
            }
        case 7:
            {
                num = "siete ";
                break;
            }
        case 6:
            {
                num = "seis ";
                break;
            }
        case 5:
            {
                num = "cinco ";
                break;
            }
        case 4:
            {
                num = "cuatro ";
                break;
            }
        case 3:
            {
                num = "tres ";
                break;
            }
        case 2:
            {
                num = "dos ";
                break;
            }
        case 1:
            {
                num = "un ";
                break;
            }
    }
    return num;
}

function decena(numero)
{
    if (numero >= 90 && numero <= 99)
    {
        num_letras = "noventa ";
        if (numero > 90)
            num_letras = num_letras + "y " + unidad(numero - 90);
    }
    else if (numero >= 80 && numero <= 89)
    {
        num_letras = "ochenta ";
        if (numero > 80)
            num_letras = num_letras + "y " + unidad(numero - 80);
    }
    else if (numero >= 70 && numero <= 79)
    {
        num_letras = "setenta ";
        if (numero > 70)
            num_letras = num_letras + "y " + unidad(numero - 70);
    }
    else if (numero >= 60 && numero <= 69)
    {
        num_letras = "sesenta ";
        if (numero > 60)
            num_letras = num_letras + "y " + unidad(numero - 60);
    }
    else if (numero >= 50 && numero <= 59)
    {
        num_letras = "cincuenta ";
        if (numero > 50)
            num_letras = num_letras + "y " + unidad(numero - 50);
    }
    else if (numero >= 40 && numero <= 49)
    {
        num_letras = "cuarenta ";
        if (numero > 40)
            num_letras = num_letras + "y " + unidad(numero - 40);
    }
    else if (numero >= 30 && numero <= 39)
    {
        num_letras = "treinta ";
        if (numero > 30)
            num_letras = num_letras + "y " + unidad(numero - 30);
    }
    else if (numero >= 20 && numero <= 29)
    {
        if (numero == 20)
            num_letras = "veinte ";
        else
            num_letras = "veinti" + unidad(numero - 20);
    }
    else if (numero >= 10 && numero <= 19)
    {
        switch (parseInt(numero))
        {
            case 10:
                {
                    num_letras = "diez ";
                    break;
                }
            case 11:
                {
                    num_letras = "once ";
                    break;
                }
            case 12:
                {
                    num_letras = "doce ";
                    break;
                }
            case 13:
                {
                    num_letras = "trece ";
                    break;
                }
            case 14:
                {
                    num_letras = "catorce ";
                    break;
                }
            case 15:
                {
                    num_letras = "quince ";
                    break;
                }
            case 16:
                {
                    num_letras = "dieciseis ";
                    break;
                }
            case 17:
                {
                    num_letras = "diecisiete ";
                    break;
                }
            case 18:
                {
                    num_letras = "dieciocho ";
                    break;
                }
            case 19:
                {
                    num_letras = "diecinueve ";
                    break;
                }
        }
    }
    else
        num_letras = unidad(numero);

    return num_letras;
}

function centena(numero)
{
    if (numero >= 100)
    {
        if (numero >= 900 & numero <= 999)
        {
            num_letras = "novecientos ";
            if (numero > 900)
                num_letras = num_letras + decena(numero - 900);
        }
        else if (numero >= 800 && numero <= 899)
        {
            num_letras = "ochocientos ";
            if (numero > 800)
                num_letras = num_letras + decena(numero - 800);
        }
        else if (numero >= 700 && numero <= 799)
        {
            num_letras = "setecientos ";
            if (numero > 700)
                num_letras = num_letras + decena(numero - 700);
        }
        else if (numero >= 600 && numero <= 699)
        {
            num_letras = "seiscientos ";
            if (numero > 600)
                num_letras = num_letras + decena(numero - 600);
        }
        else if (numero >= 500 && numero <= 599)
        {
            num_letras = "quinientos ";
            if (numero > 500)
                num_letras = num_letras + decena(numero - 500);
        }
        else if (numero >= 400 && numero <= 499)
        {
            num_letras = "cuatrocientos ";
            if (numero > 400)
                num_letras = num_letras + decena(numero - 400);
        }
        else if (numero >= 300 && numero <= 399)
        {
            num_letras = "trescientos ";
            if (numero > 300)
                num_letras = num_letras + decena(numero - 300);
        }
        else if (numero >= 200 && numero <= 299)
        {
            num_letras = "doscientos ";
            if (numero > 200)
                num_letras = num_letras + decena(numero - 200);
        }
        else if (numero >= 100 && numero <= 199)
        {
            if (numero == 100)
                num_letras = "cien ";
            else
                num_letras = "ciento " + decena(numero - 100);
        }
    }
    else
        num_letras = decena(numero);
    return num_letras;
}

function cien()
{
    parcial = 0;
    car = 0;
    var cadena = '';
    for (var j = 0; j < importe_parcial.length; j++) {
        if (importe_parcial.charAt(j) == '.')
            break;
        cadena += 0;
    }
    if (cadena != importe_parcial.split('.')[0])
    {
        while (importe_parcial.substring(0, 1) == 0)
            importe_parcial = importe_parcial.substring(1, (importe_parcial.length));
        if (importe_parcial >= 1 && importe_parcial <= 9.99)
            car = 1;
        else if (importe_parcial >= 10 && importe_parcial <= 99.99)
            car = 2;
        else if (importe_parcial >= 100 && importe_parcial <= 999.99)
            car = 3;
        parcial = importe_parcial.substring(0, car);
        importe_parcial = importe_parcial.substring(car);
        num_letras = centena(parcial) + centimos();
    }
    else
    {
        num_letras = '' + centimos();
    }
    return num_letras;
}

function cien_mil(numero)
{
    if (numero)
        importe_parcial = numero;
    parcial = 0;
    car = 0;
    var cadena = '';
    for (var j = 0; j < importe_parcial.length; j++) {
        if (importe_parcial.charAt(j) == '.')
            break;
        cadena += 0;
    }
    if (cadena != importe_parcial.split('.')[0])
    {
        while (importe_parcial.substring(0, 1) == 0)
            importe_parcial = importe_parcial.substring(1, (importe_parcial.length));
        if (importe_parcial >= 1000 && importe_parcial <= 9999.99)
            car = 1;
        else if (importe_parcial >= 10000 && importe_parcial <= 99999.99)
            car = 2;
        else if (importe_parcial >= 100000 && importe_parcial <= 999999.99)
            car = 3;

        parcial = importe_parcial.substring(0, car);
        importe_parcial = importe_parcial.substring(car);

        if (parcial > 0)
        {
            if (parcial == 1)
                num_letras = "mil ";
            else
                num_letras = centena(parcial) + " mil ";
        }
    }
    else
    {
        num_letras = '';
    }
    return num_letras;
}

function millon()
{
    parcial = 0;
    car = 0;
    var cadena = '';
    for (var j = 0; j < importe_parcial.length; j++) {
        if (importe_parcial.charAt(j) == '.')
            break;
        cadena += 0;
    }
    if (cadena != importe_parcial.split('.')[0])
    {
        while (importe_parcial.substring(0, 1) == 0)
            importe_parcial = importe_parcial.substring(1, (importe_parcial.length) - 1);
        if (importe_parcial >= 1000000 && importe_parcial <= 9999999.99)
            car = 1;
        else if (importe_parcial >= 10000000 && importe_parcial <= 99999999.99)
            car = 2;
        else if (importe_parcial >= 100000000 && importe_parcial <= 999999999.99)
            car = 3;

        parcial = importe_parcial.substring(0, car);
        importe_parcial = importe_parcial.substring(car);

        if (parcial == 1)
            num_letras = "un mill\xf3n";
        else
            num_letras = centena(parcial) + " millones ";
    }
    else
    {
        num_letras = '';
    }
    return num_letras;
}

function miles_millones()
{
    parcial = 0;
    car = 0;
    var cadena = '';
    for (var j = 0; j < importe_parcial.length; j++)
    {
        if (importe_parcial.charAt(j) == '.')
            break;
        cadena += 0;
    }
    if (cadena != importe_parcial.split('.')[0])
    {
        while (importe_parcial.substring(0, 1) == 0)
            importe_parcial = importe_parcial.substring(1, (importe_parcial.length) - 1);
        if (importe_parcial >= 1000000000 && importe_parcial <= 9999999999.99)
            car = 1;
        else if (importe_parcial >= 10000000000 && importe_parcial <= 99999999999.99)
            car = 2;
        else if (importe_parcial >= 100000000000 && importe_parcial <= 999999999999.99)
            car = 3;

        parcial = importe_parcial.substring(0, car);
        importe_parcial = importe_parcial.substring(car);

        if (parcial == 1)
            num_letras = " mil millones ";
        else
            num_letras = centena(parcial) + " mil millones ";
    }
    else
    {
        num_letras = '';
    }

    return num_letras;
}

function billon()
{
    parcial = 0;
    car = 0;
    var cadena = '';
    for (var j = 0; j < importe_parcial.length; j++) {
        if (importe_parcial.charAt(j) == '.')
            break;
        cadena += 0;
    }
    if (cadena != importe_parcial.split('.')[0])
    {
        while (importe_parcial.substring(0, 1) == 0)
            importe_parcial = importe_parcial.substring(1, (importe_parcial.length) - 1);
        if (importe_parcial >= 1000000000000 && importe_parcial <= 9999999999999.99)
            car = 1;
        else if (importe_parcial >= 10000000000000 && importe_parcial <= 99999999999999.99)
            car = 2;
        else if (importe_parcial >= 100000000000000 && importe_parcial <= 999999999999999.99)
            car = 3;

        parcial = importe_parcial.substring(0, car);
        importe_parcial = importe_parcial.substring(car);

        if (parcial == 1)
            num_letras = "un bill\xf3n";
        else
            num_letras = centena(parcial) + " billones ";
    }
    else
    {
        num_letras = '';
    }
    return num_letras;
}

function miles_billones()
{
    parcial = 0;
    car = 0;
    var cadena = '';
    for (var j = 0; j < importe_parcial.length; j++)
    {
        if (importe_parcial.charAt(j) == '.')
            break;
        cadena += 0;
    }
    if (cadena != importe_parcial.split('.')[0])
    {
        while (importe_parcial.substring(0, 1) == 0)
            importe_parcial = importe_parcial.substring(1, (importe_parcial.length) - 1);
        if (importe_parcial >= 1000000000000000 && importe_parcial <= 9999999999999999.99)
            car = 1;
        else if (importe_parcial >= 10000000000000000 && importe_parcial <= 99999999999999999.99)
            car = 2;
        else if (importe_parcial >= 100000000000000000 && importe_parcial <= 999999999999999999.99)
            car = 3;

        parcial = importe_parcial.substring(0, car);
        importe_parcial = importe_parcial.substring(car);

        if (parcial == 1)
            num_letras = "mil billones ";
        else
            num_letras = centena(parcial) + " mil billones ";
    }
    else
    {
        num_letras = '';
    }

    return num_letras;
}

function convertir_a_letras(numero)
{
    importe_parcial = numero * 1;
    importe_parcial = importe_parcial.toString();
    if (numero < 10000000000000000)
    {
        if (numero >= 1000000000000000 && numero <= 9999999999999999.99)
            num_letras = miles_billones() + billon() + miles_millones() + millon() + cien_mil() + cien();
        else if (numero >= 1000000000000 && numero <= 9999999999999999.99)
            num_letras = billon() + miles_millones() + millon() + cien_mil() + cien();
        else if (numero >= 1000000000 && numero <= 999999999999.99)
            num_letras = miles_millones() + millon() + cien_mil() + cien();
        else if (numero >= 1000000 && numero <= 999999999.99)
            num_letras = millon() + cien_mil() + cien();
        else if (numero >= 1000 && numero <= 999999.99)
            num_letras = cien_mil() + cien();
        else if (numero >= 1 && numero <= 999.99)
            num_letras = cien();
        else if (numero >= 0.01 && numero <= 0.99)
        {
            if (numero == 0.01)
                num_letras = "un centavo";
            else
            {
                //	En este caso parametro 'true' => indica que es de los centavos
                cent = true;
                num_letras = convertir_a_letras((numero * 100)) + " centavos";
            }
        }
    }

    result = '';
    for (i = 0; i <= num_letras.length - 1; i++) {
        result += num_letras[i].toUpperCase();
    }
    return result;
}

//});
