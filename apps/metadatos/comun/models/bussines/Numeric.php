<?php

/**
 * Class Numeric
 * Clase para la conversion de numeros a texto
 */
class Numeric
{
    /**
     * @param      $xcifra
     * @param bool $isDate
     *
     * @return string
     */
    /** @noinspection PhpUndefinedClassInspection */
    static function toString($xcifra, $isDate = FALSE)
    {
        /** @noinspection PhpTraditionalSyntaxArrayLiteralInspection */
        $xarray = array(
            0 => "Cero", 1 => "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ", "ONCE",
            "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE", "VEINTI",
            30 => "TREINTA", 40 => "CUARENTA", 50 => "CINCUENTA", 60 => "SESENTA", 70 => "SETENTA", 80 => "OCHENTA",
            90 => "NOVENTA", 100 => "CIENTO", 200 => "DOSCIENTOS", 300 => "TRESCIENTOS", 400 => "CUATROCIENTOS",
            500 => "QUINIENTOS", 600 => "SEISCIENTOS", 700 => "SETECIENTOS", 800 => "OCHOCIENTOS",
            900 => "NOVECIENTOS");
        /** @noinspection PhpTraditionalSyntaxArrayLiteralInspection */
        $xarrayDate = array(
            0 => "Cero", 1 => "PRIMERO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ",
            "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE",
            "VEINTI", 30 => "TREINTA", 40 => "CUARENTA", 50 => "CINCUENTA", 60 => "SESENTA", 70 => "SETENTA",
            80 => "OCHENTA", 90 => "NOVENTA", 100 => "CIENTO", 200 => "DOSCIENTOS", 300 => "TRESCIENTOS",
            400 => "CUATROCIENTOS", 500 => "QUINIENTOS", 600 => "SEISCIENTOS", 700 => "SETECIENTOS",
            800 => "OCHOCIENTOS", 900 => "NOVECIENTOS");
        /** @noinspection PhpTraditionalSyntaxArrayLiteralInspection */
        $xarrayUnidad = array(
            0 => "Cero", 1 => "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE");
        $xcifra = trim($xcifra);
        $xposPunto = strpos($xcifra, ".");
        $xauxInt = $xcifra;
        if (!($xposPunto === FALSE)) {
            if ($xposPunto == 0) {
                $xcifra = "0" . $xcifra;
                $xposPunto = strpos($xcifra, ".");
            }
            $xauxInt = substr($xcifra, 0, $xposPunto); // obtengo el entero de la cifra a covertir
        }
        /** @var $xauxInt str_pad */
        $xAUX = str_pad(
            $xauxInt, 18, " ", STR_PAD_LEFT
        ); // ajusto la longitud de la cifra, para que sea divisible por centenas de miles (grupos de 6)
        $xcadena = "";
        for ($xz = 0; $xz < 3; $xz++) {
            $xaux = substr($xAUX, $xz * 6, 6);
            $xi = 0;
            $xlimite = 6;
            $xexit = TRUE; // bandera para controlar el ciclo del While
            while ($xexit) {
                if ($xi == $xlimite) { // si ya llegó al límite máximo de enteros
                    break; // termina el ciclo
                }
                $xCentenaDigitos = ($xlimite - $xi) *
                    -1; // comienzo con los tres primeros digitos de la cifra, comenzando por la izquierda
                // obtengo la centena (los tres dígitos)
                $xaux = substr($xaux, $xCentenaDigitos, abs($xCentenaDigitos));
                for ($xy = 1; $xy < 4; $xy++) { // ciclo para revisar centenas, decenas y unidades, en ese orden
                    switch ($xy){
                        case 1:
                            // checa las centenas
                            // si el grupo de tres dígitos es menor a una centena ( < 99) no hace nada
                            // y pasa a revisar las decenas
                            if (substr($xaux, 0, 3) >= 100) {
                                $key = (int) substr($xaux, 0, 3);
                                if ($isDate) {
                                    if (TRUE === array_key_exists($key, $xarrayDate)
                                    ) { // busco si la centena es número redondo (100, 200, 300, 400, etc..)
                                        $xseek = $xarrayDate[$key];
                                        $xsub = self::subfijo($xaux);
                                        if (substr($xaux, 0, 3) == 100) {
                                            $xcadena = " " . $xcadena . " CIEN " . $xsub;
                                        } else {
                                            $xcadena = " " . $xcadena . " " . $xseek . " " . $xsub;
                                        }
                                        $xy = 3;
                                        // la centena fue redonda, entonces termino el ciclo del for y ya no
                                        // reviso decenas ni unidades
                                    } else {
                                        // entra aquí si la centena no fue numero
                                        // redondo (101, 253, 120, 980, etc.)
                                        $key = (int) substr($xaux, 0, 1) * 100;
                                        $xseek = $xarrayDate[$key];
                                        // toma el primer caracter de la centena y lo multiplica por cien y lo busca
                                        //en el arreglo (para que busque 100,200,300, etc)
                                        $xcadena = " " . $xcadena . " " . $xseek;
                                    } // ENDIF ($xseek)
                                } else {
                                    if (TRUE === array_key_exists($key, $xarray)
                                    ) { // busco si la centena es número redondo (100, 200, 300, 400, etc..)
                                        $xseek = $xarray[$key];
                                        $xsub = self::subfijo($xaux);
                                        if (substr($xaux, 0, 3) == 100) {
                                            $xcadena = " " . $xcadena . " CIEN " . $xsub;
                                        } else {
                                            $xcadena = " " . $xcadena . " " . $xseek . " " . $xsub;
                                        }
                                        $xy = 3;
                                        // la centena fue redonda, entonces termino el ciclo del for y ya
                                        //no reviso decenas ni unidades
                                    } else {
                                        // entra aquí si la centena no fue numero redondo (101, 253, 120, 980, etc.)
                                        $key = (int) substr($xaux, 0, 1) * 100;
                                        $xseek = $xarray[$key];
                                        // toma el primer caracter de la centena y lo multiplica por cien y lo busca en
                                        // el arreglo (para que busque 100,200,300, etc)
                                        $xcadena = " " . $xcadena . " " . $xseek;
                                    } // ENDIF ($xseek)
                                } // ENDIF (substr($xaux, 0, 3) < 100)
                            }
                            break;
                        case 2: // checa las decenas (con la misma lógica que las centenas)
                            if (substr($xaux, 1, 2) < 10) {
                            } else {
                                $key = (int) substr($xaux, 1, 2);
                                if ($isDate) {
                                    if (TRUE === array_key_exists($key, $xarrayDate)) {
                                        $xseek = $xarrayDate[$key];
                                        $xsub = self::subfijo($xaux);
                                        if (substr($xaux, 1, 2) == 20) {
                                            $xcadena = " " . $xcadena . " VEINTE " . $xsub;
                                        } else {
                                            $xcadena = " " . $xcadena . " " . $xseek . " " . $xsub;
                                        }
                                        $xy = 3;
                                    } else {
                                        $key = (int) substr($xaux, 1, 1) * 10;
                                        $xseek = $xarrayDate[$key];
                                        if (20 == substr($xaux, 1, 1) * 10) {
                                            $xcadena = " " . $xcadena . " " . $xseek;
                                        } else {
                                            $xcadena = " " . $xcadena . " " . $xseek . " Y ";
                                        }
                                    } // ENDIF ($xseek)
                                } else {
                                    if (TRUE === array_key_exists($key, $xarray)) {
                                        $xseek = $xarray[$key];
                                        $xsub = self::subfijo($xaux);
                                        if (substr($xaux, 1, 2) == 20) {
                                            $xcadena = " " . $xcadena . " VEINTE " . $xsub;
                                        } else {
                                            $xcadena = " " . $xcadena . " " . $xseek . " " . $xsub;
                                        }
                                        $xy = 3;
                                    } else {
                                        $key = (int) substr($xaux, 1, 1) * 10;
                                        $xseek = $xarray[$key];
                                        if (20 == substr($xaux, 1, 1) * 10) {
                                            $xcadena = " " . $xcadena . " " . $xseek;
                                        } else {
                                            $xcadena = " " . $xcadena . " " . $xseek . " Y ";
                                        }
                                    }
                                    // ENDIF ($xseek)
                                }
                            }
                            // ENDIF (substr($xaux, 1, 2) < 10)
                            break;
                        case 3: // checa las unidades
                            if (substr($xaux, 2, 1) >= 1) {
                                if ($isDate) {
                                    $key = (int) substr($xaux, 2, 1);
                                    $xseek = $xarrayDate[$key];
                                    // obtengo directamente el valor de la unidad (del uno al nueve)
                                    $xsub = self::subfijo($xaux);
                                    $xcadena = " " . $xcadena . " " . $xseek . " " . $xsub;
                                } else {
                                    $key = (int) substr($xaux, 2, 1);
                                    $xseek = $xarrayUnidad[$key];
                                    // obtengo directamente el valor de la unidad (del uno al nueve)
                                    $xsub = self::subfijo($xaux);
                                    if ($xseek == 'UNO' && $xsub != '') {
                                        $xseek = '';
                                    }
                                    $xcadena = " " . $xcadena . " " . $xseek . " " . $xsub;
                                }
                            } // ENDIF (substr($xaux, 2, 1) < 1)
                            break;
                    } // END SWITCH
                } // END FOR
                $xi = $xi + 3;
            } // ENDDO
            // si la cadena obtenida termina en MILLON o BILLON, entonces le agrega al final la conjuncion DE
            if (substr(trim($xcadena), -5, 5) == "ILLON") {
                $xcadena .= " DE";
            }
            // si la cadena obtenida en MILLONES o BILLONES, entoncea le agrega al final la conjuncion DE
            if (substr(trim($xcadena), -7, 7) == "ILLONES") {
                $xcadena .= " DE";
            }
            // ----------- esta línea la puedes cambiar de acuerdo a tus necesidades o a tu país -------
            if (trim($xaux) != "") {
                switch ($xz){
                    case 0:
                        if (trim(substr($xAUX, $xz * 6, 6)) == "1") {
                            $xcadena .= "UN BILLON ";
                        } else {
                            $xcadena .= " BILLONES ";
                        }
                        break;
                    case 1:
                        if (trim(substr($xAUX, $xz * 6, 6)) == "1") {
                            $xcadena .= "UN MILLON ";
                        } else {
                            $xcadena .= " MILLONES ";
                        }
                        break;
                } // endswitch ($xz)
            } // ENDIF (trim($xaux) != "")
            // ------------------      en este caso, para México se usa esta leyenda     ----------------
            $xcadena = str_replace(
                "VEINTI ", "VEINTI", $xcadena
            ); // quito el espacio para el VEINTI, para que quede: VEINTICUATRO, VEINTIUN, VEINTIDOS, etc
            $xcadena = str_replace("  ", " ", $xcadena); // quito espacios dobles
            $xcadena = str_replace("UN UN", "UN", $xcadena); // quito la duplicidad
            $xcadena = str_replace("  ", " ", $xcadena); // quito espacios dobles
            $xcadena = str_replace("BILLON DE MILLONES", "BILLON DE", $xcadena); // corrigo la leyenda
            $xcadena = str_replace("BILLONES DE MILLONES", "BILLONES DE", $xcadena); // corrigo la leyenda
            $xcadena = str_replace("DE UN", "UN", $xcadena); // corrigo la leyenda
        } // ENDFOR ($xz)
        return strtolower(trim($xcadena));
    }

// END FUNCTION
    /**
     * @param $xx
     *
     * @return string
     */
    private function subfijo($xx)
    {
        $xx = trim($xx);
        $xstrlen = strlen($xx);
        if ($xstrlen == 1 || $xstrlen == 2 || $xstrlen == 3) {
            $xsub = "";
        }
        if ($xstrlen == 4 || $xstrlen == 5 || $xstrlen == 6) {
            $xsub = "MIL";
        }
        /** @noinspection PhpUndefinedVariableInspection */
        return $xsub;
    }

    /**
     * @param $fecha
     *
     * @return string
     */
    static function dateToString($fecha)
    {
        $fecha = explode('/', $fecha);
        $dia = intval($fecha[0]);
        $mes = self::dameMes($fecha[1]);
        $ano = intval($fecha[2]);
        return self::toString($dia, TRUE) . ' de ' . $mes . ' del ' . self::toString($ano);
    }

    /**
     * @param $number
     *
     * @return mixed
     */
    private function dameMes($number)
    {
        $number = intval($number) - 1;
        /** @noinspection PhpTraditionalSyntaxArrayLiteralInspection */
        $meses = array(
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre',
            'noviembre', 'diciembre',);
        return $meses[$number];
    }
}