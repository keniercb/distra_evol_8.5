<?php

/**
 * Class Util
 */
class Util
{
    /**
     * @param $arregloDatos
     * @param $includeMilitares
     * @param $index
     * @param $organ
     * @param $indexDatos
     * @param $subTotal
     * @param $subTotalReal
     * @param $arrayCargos
     * @param $datosReales
     * @param $cargo
     * @param $pos
     * @param $existeId
     * @param $denominacion
     * @param $valor
     * @param $cantidad
     * @param $cantidadreal
     * @param $preparacion
     * @param $grupoSalario
     */
    private static function getTablaOrganosCargo(
        $arregloDatos, $includeMilitares, $index, &$organ, $indexDatos, &$subTotal, &$subTotalReal, &$arrayCargos,
        &$datosReales, &$cargo, &$pos, &$existeId, &$denominacion, &$valor, &$cantidad, &$cantidadreal, &$preparacion,
        &$grupoSalario
    )
    {
        if ($index == 'cargos') {
            $datosReales = [];
            foreach ($organ as $cargo) {
                /** @noinspection PhpParamsInspection */
                $pos = Util::buscarExistencia($datosReales, $cargo['denominacion']);
                $existeId = Util::buscarIdInDatos($arregloDatos, $cargo['id'], $indexDatos);
                $subTotal += $cargo['cantidad'];
                $subTotalReal += $cargo['cantidad_real'];
                $datosReales = self::getDatos($datosReales, $cargo, $pos, $existeId);
            }
            $organ = $datosReales;
            foreach ($organ as $cargo) {
                $denominacion = $cargo['denominacion'];
                $categoria = ($cargo['idcategocup']) ? $cargo['abrev_categocup'] : '-';
                $grado = ($cargo['idgrado']) ? $cargo['abrev_grado'] : '-';
                $valor = (!$cargo['idcategocup'] && $includeMilitares) ? $grado : $categoria;
                $cantidad = $cargo['cantidad'];
                $cantidadreal = $cargo['cantidad_real'];
                $preparacion = (!$cargo['idpreparacion']) ? '-' : $cargo['abrev_preparacion'];
                $grupoSalario = $cargo['grupocomplejidad'];
                if ($denominacion != '') {
                    $arrayCargos[] = [
                        'denominacion' => $denominacion, 'valores' => $valor, 'cantidad' => $cantidad,
                        'preparacion' => $preparacion, 'salario' => $grupoSalario, 'cantidad_real' => $cantidadreal];
                }
            }
        }
    }

    /**
     * @param $arregloDatos
     * @param $index
     * @param $organ
     * @param $indexDatos
     * @param $subTotal
     * @param $subTotalReal
     * @param $arrayMedios
     * @param $organos
     * @param $arrayCargos
     * @param $isParent
     * @param $totales
     * @param $totalesReales
     * @param $posPadre
     * @param $datosReales
     * @param $medio
     * @param $pos
     * @param $existeId
     * @param $denominacion
     * @param $cantidad
     * @param $cantidadreal
     * @param $preparacion
     * @param $grupoSalario
     */
    private static function getTablaOrganosMedio(
        $arregloDatos, $index, &$organ, $indexDatos, &$subTotal, &$subTotalReal, $arrayMedios, &$organos, $arrayCargos,
        $isParent, &$totales, &$totalesReales, $posPadre, &$datosReales, &$medio, &$pos, &$existeId, &$denominacion,
        &$cantidad, &$cantidadreal, &$preparacion, &$grupoSalario
    )
    {
        if ($index == 'medios') {
            $datosReales = [];
            foreach ($organ as $medio) {
                /** @noinspection PhpParamsInspection */
                $pos = Util::buscarExistencia($datosReales, $medio['denominacion']);
                $existeId = Util::buscarIdInDatos($arregloDatos, $medio['id'], $indexDatos);
                $datosReales = self::getDatosM($datosReales, $medio, $pos, $existeId);
            }
            $organ = $datosReales;
            foreach ($organ as $medio) {
                $denominacion = $medio['denominacion'];
                $cantidad = $medio['cantidad'];
                $cantidadreal = $medio['cantidad_real'];
                $subTotal += $cantidad;
                $subTotalReal += $cantidadreal;
                $preparacion = ' ';
                $grupoSalario = ' ';
                if ($denominacion != '') {
                    $arrayMedios[] = [
                        'denominacion' => $denominacion, 'valores' => '', 'cantidad' => $cantidad,
                        'preparacion' => $preparacion, 'salario' => $grupoSalario, 'cantidad_real' => $cantidadreal];
                }
            }
            $organos = array_merge_recursive($organos, $arrayCargos, $arrayMedios);
            if (!$isParent) {
                $totales = $totales + $subTotal;
                $totalesReales = $totalesReales + $subTotalReal;
                $organos[] = [
                    'denominacion' => 'Subtotal', 'valores' => '', 'cantidad' => $subTotal, 'preparacion' => '',
                    'salario' => '', 'cantidad_real' => $subTotalReal,
                    'total' => ($organos[$posPadre]['padre']) ? 1 : 0];
            }
        }
    }

    /**
     * @param $arregloDatos
     * @param $index
     * @param $datos
     * @param $indexDatos
     * @param $organos
     * @param $total
     * @param $isParent
     * @param $cargo
     * @param $existeId
     * @param $medio
     * @param $posPadre
     */
    private static function getTablaOrganosEstructura(
        $arregloDatos, $index, $datos, $indexDatos, &$organos, &$total, &$isParent, &$cargo, &$existeId, &$medio,
        &$posPadre
    )
    {
        if ($index == 'denominacion') {
            $isParent = FALSE;
            $totalOrgano = 0;
            $cargos = $datos['cargos'];
            $medios = $datos['medios'];
            foreach ($cargos as $cargo) {
                $existeId = Util::buscarIdInDatos($arregloDatos, $cargo['id'], $indexDatos);
                list($isParent, $totalOrgano) = self::asingTotalCargo($cargo, $existeId, $totalOrgano, $isParent);
            }
            foreach ($medios as $medio) {
                $existeId = Util::buscarIdInDatos($arregloDatos, $medio['id'], $indexDatos);
                list($isParent, $totalOrgano) = self::assignTotalMedio($existeId, $medio, $totalOrgano, $isParent);
            }
            if ($isParent && $organos[count($organos) - 1]['denominacion'] == 'Subtotal') {
                $posGeneral = count($organos);
                $total [$posGeneral] = $totalOrgano;
            }
            $organos[] = ['next' => TRUE, 'padre' => $isParent, 'denominacion' => $datos['denominacion']];
            $posPadre = count($organos);
        }
    }

    /**
     * Retorna la variable de Perfil Global para la obtencion de los datos necesarios
     *
     * @return object
     */
    static function getPerfilGlobal()
    {
        $globalConcept = ZendExt_GlobalConcept::getInstance();
        /** @noinspection PhpUndefinedFieldInspection */
        return $globalConcept->Perfil;
    }

    /**
     * Descripción del método: Sustituye de un string insertado los caracteres especiales no modificables.
     *
     * @author    : Ing. Osvaldo M. Gonzalez.
     *
     * @param $text
     *
     * @return string String en Mayuscula con los caracteres sustituidos
     * @copyright Copyright (c) 2013 xetid.
     */
    static function fixTitle($text)
    {
        $text = strtolower($text);
        $replace = str_split("àáâãäåæçèéêëìíîïðñòóôõöøùüú");
        $search = str_split("ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÜÚ");
        foreach ($search as $index => $value) {
            if (is_numeric(strpos($text, $value))) {
                $text = str_replace($value, $replace[$index], $text);
            }
        }
        return $text;
    }

    /**
     * @param $text
     *
     * @return mixed|string
     */
    static function fixTitleReverse($text)
    {
        $text = strtolower($text);
        $search = str_split("àáâãäåæçèéêëìíîïðñòóôõöøùüú");
        $replace = str_split("ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÜÚ");
        foreach ($search as $index => $value) {
            if (is_numeric(strpos($text, $value))) {
                $text = str_replace($value, $replace[$index], $text);
            }
        }
        return $text;
    }

    /**
     * Descripción del método: Se crea una tabla con los cargos.
     *
     * @author    : Ing. Osvaldo M. Gonzalez.
     * @modify    : Ing. Yoandry Borges.
     * @modify    : Ing. Pedro Jiménez.
     *
     * @param $arrayCargos
     * @param $inMilitares
     *
     * @return array un arreglo de cargos
     * @copyright Copyright (c) 2013 xetid.
     */
    static function arrayTablaCargos($arrayCargos, $includeMilitares)
    {
        $temporal    = array();
        $tablaCargos = array();
        $flag        = FALSE;
        foreach ($arrayCargos as $cargos)
        {
            if (count($tablaCargos) > 0)
            {
                foreach ($tablaCargos as $index => $tc)
                {
                    if ($tc['text'] == $cargos['denominacion'])
                    {
                        if ($cargos['idcategocup'] != '')
                        {
                            $tablaCargos[$index]['cantidadCivil'] += $cargos['cantidad'];
                        } else
                        {
                            $tablaCargos[$index]['cantidadMilitar'] += $cargos['cantidad'];
                        }
                        $flag = TRUE;
                    }
                }
                if (!$flag)
                {
                    $temporal['id']         = $cargos['id'];
                    $temporal['idconcepto'] = $cargos['idconcepto'];
                    $temporal['text']       = $cargos['denominacion'];
                    $temporal['civil']      = $cargos['civil'];
                    if ($cargos['idcategocup'] != '')
                    {
                        $temporal['cantidadCivil']   = $cargos['cantidad'];
                        $temporal['cantidadMilitar'] = 0;
                    } else
                    {
                        $temporal['cantidadMilitar'] = $cargos['cantidad'];
                        $temporal['cantidadCivil']   = 0;
                    }
                    $temporal['tipomedio'] = $cargos['tipomedio'];
                    if ($cargos['idcategocup'] != '')
                    {
                        $tablaCargos[] = $temporal;
                    } else
                    {
                        if ($includeMilitares)
                        {
                            $tablaCargos[] = $temporal;
                        }
                    }
                } else
                {
                    $flag = FALSE;
                }
            } else
            {
                $temporal['id']         = $cargos['id'];
                $temporal['idconcepto'] = $cargos['idconcepto'];
                $temporal['text']       = $cargos['denominacion'];
                $temporal['civil']      = $cargos['civil'];
                if ($cargos['idcategocup'] != '')
                {
                    $temporal['cantidadCivil']   = $cargos['cantidad'];
                    $temporal['cantidadMilitar'] = 0;
                } else
                {
                    $temporal['cantidadMilitar'] = $cargos['cantidad'];
                    $temporal['cantidadCivil']   = 0;
                }
                $temporal['tipomedio'] = $cargos['tipomedio'];
                if ($cargos['idcategocup'] != '')
                {
                    $tablaCargos[0] = $temporal;
                } else
                {
                    if ($includeMilitares)
                    {
                        $tablaCargos[0] = $temporal;
                    }
                }
            }
        }

        return $tablaCargos;
    }

    /**
     * Descripción del método: Busca si hay alguna denominación determinada.
     *
     * @author    : Ing. Osvaldo M. Gonzalez.
     * @modify    : Ing. Yoandry Borges.
     * @modify    : Ing. Pedro Jiménez.
     *
     * @param      $arreglo
     * @param      $denominacion
     * @param bool $plantilla
     * @param bool $object
     *
     * @return array un arreglo de coincidencias.
     * @copyright Copyright (c) 2013 xetid.
     */
    static function buscarExistencia($arreglo, $denominacion, $plantilla = FALSE, $object = FALSE)
    {
        /** @noinspection PhpParamsInspection */
        if (count($arreglo) > 0) {
            foreach ($arreglo as $index => $value) {
                if ($plantilla) {
                    $flagDenom = Util::fixTitle($value['denominacion']) == Util::fixTitle($object['denominacion']);
                    $flagCateg = Util::fixTitle($value['categocup']) == Util::fixTitle($object['categocup']);
                    $flagEsp = Util::fixTitle($value['especialidad']) == Util::fixTitle($object['especialidad']);
                    $flagPrep = Util::fixTitle($value['preparacion']) == Util::fixTitle($object['preparacion']);
                    if ($flagDenom && $flagCateg && $flagEsp && $flagPrep) {
                        return $index;
                    }
                } else {
                    if (Util::fixTitle($value['denominacion']) == Util::fixTitle($denominacion)) {
                        return $index;
                    }
                }
            }
        }
        return FALSE;
    }

    /**
     * Descripción del método: Se crea una tabla con las categorías.
     *
     * @author    : Ing. Osvaldo M. Gonzalez.
     * @modify    : Ing. Yoandry Borges.
     * @modify    : Ing. Pedro Jiménez.
     *
     * @param $arregloDatos
     *
     * @return array un arreglo con los datos de las categorías.
     * @copyright Copyright (c) 2013 xetid.
     */
    static function construirTablaCategoria($arregloDatos)
    {
        $agrupados = [];
        $civiles = [];
        $militares = [];
        $cantidadCivil = 0;
        $cantidadMilitar = 0;
        foreach ($arregloDatos as $value) {
            $denominacion = ($value['categocup']) ? $value['categocup'] : $value['grado'];
            $cantidad = $value['cantidad'];
            if ($value['categocup']) {
                $cantidadCivil += $cantidad;
                /** @noinspection PhpParamsInspection */
                $pos = Util::buscarExistencia($civiles, $denominacion);
                if (is_numeric($pos)) {
                    $civiles[$pos]['cantidad'] += $cantidad;
                } else {
                    $civiles[] = ['denominacion' => $denominacion, 'cantidad' => $cantidad];
                }
            } else {
                $cantidadMilitar += $cantidad;
                /** @noinspection PhpParamsInspection */
                $pos = Util::buscarExistencia($militares, $denominacion);
                if (is_numeric($pos)) {
                    $militares[$pos]['cantidad'] += $cantidad;
                } else {
                    $militares[] = ['denominacion' => $denominacion, 'cantidad' => $cantidad];
                }
            }
        }
        $agrupados['civiles'] = $civiles;
        $agrupados['cantidad']['civil'] = $cantidadCivil;
        $agrupados['militares'] = $militares;
        $agrupados['cantidad']['militar'] = $cantidadMilitar;
        $agrupados['total'] = $cantidadMilitar + $cantidadCivil;
        return $agrupados;
    }

    /**
     * Función para buscar dentro de un arreglo
     *
     * @param $datos
     * @param $id
     * @param $start
     *
     * @return bool
     */
    static function buscarIdInDatos($datos, $id, $start)
    {
        foreach ($datos as $index => $data) {
            if ($index > $start) {
                foreach ($data as $cargos) {
                    foreach ($cargos as $cargo) {
                        if ($cargo['id'] == $id) {
                            return TRUE;
                        }
                    }
                }
            }
        }
        return FALSE;
    }

    /**
     * Para verificar si existe un elemento dentro de un arreglo
     *
     * @param        $datos
     * @param        $id
     * @param string $campo
     *
     * @return bool|int|string
     */
    static function existeIdInArray($datos, $id, $campo = 'id')
    {
        foreach ($datos as $index => $data) {
            if ($data[$campo] == $id) {
                return $index;
            }
        }
        return FALSE;
    }

    /**
     * Función para sustituir un elemento en un array
     *
     * @param        $datos
     * @param        $id
     * @param string $campo
     *
     * @return array
     */
    static function replaceElementInArrayByPos($datos, $id, $campo = 'id')
    {
        $pos = self::existeIdInArray($datos, $id, $campo);
        if (is_numeric($pos)) {
            $lft = array_slice($datos, 0, $pos);
            $rgt = array_slice($datos, $pos + 1);
            $data = array_merge($lft, $rgt);
            return $data;
        } else {
            return $datos;
        }
    }

    /**
     * Función para completar espacios
     *
     * @param $cantidad
     *
     * @return string
     */
    static function completarEspacios($cantidad)
    {
        $txt = '';
        while ($cantidad > 0) {
            $txt .= ' ';
            $cantidad--;
        }
        return $txt;
    }

    /**
     * Funcion para obtener el padre dado un arreglo
     *
     * @param $arregloDatos
     * @param $idpadre
     * @param $index
     *
     * @return bool|int|string
     */
    static function buscarPadreInArreglo($arregloDatos, $idpadre, $index)
    {
        foreach ($arregloDatos as $indexDatos => $datos) {
            if ($datos['id'] == $idpadre && $indexDatos != $index) {
                return $indexDatos;
            }
        }
        return FALSE;
    }

    /**
     * Descripción del método: Se crea una tabla con los organos.
     *
     * @author    : Ing. Osvaldo M. Gonzalez.
     * @modify    : Ing. Yoandry Borges.
     * @modify    : Ing. Pedro Jiménez.
     *
     * @param $arregloDatos
     * @param $includeMilitares
     *
     * @return array un arreglo con los datos de los organos.
     * @copyright Copyright (c) 2013 xetid.
     */
    static function tablaOrganos($arregloDatos, $includeMilitares)
    {
        $organos = [];
        $total = [];
        $totales = 0;
        $totalesReales = 0;
        foreach ($arregloDatos as $indexDatos => $datos) {
            $subTotal = 0;
            $subTotalReal = 0;
            $isParent = FALSE;
            $arrayCargos = [];
            $arrayMedios = [];
            $posPadre = 0;
            foreach ($datos as $index => $organ) {
                self::getTablaOrganosEstructura(
                    $arregloDatos, $index, $datos, $indexDatos, $organos, $total, $isParent, $cargo, $existeId, $medio,
                    $posPadre
                );
                self::getTablaOrganosCargo(
                    $arregloDatos, $includeMilitares, $index, $organ, $indexDatos, $subTotal, $subTotalReal,
                    $arrayCargos, $datosReales, $cargo, $pos, $existeId, $denominacion, $valor, $cantidad,
                    $cantidadreal, $preparacion, $grupoSalario
                );
                self::getTablaOrganosMedio(
                    $arregloDatos, $index, $organ, $indexDatos, $subTotal, $subTotalReal, $arrayMedios, $organos,
                    $arrayCargos, $isParent, $totales, $totalesReales, $posPadre, $datosReales, $medio, $pos, $existeId,
                    $denominacion, $cantidad, $cantidadreal, $preparacion, $grupoSalario
                );
            }
        }
        $resultado = [];
        $cantidad = 0;
        $cantidadreal = 0;
        foreach ($organos as $index => $valor) {
            if ($valor['denominacion'] != 'Subtotal') {
                $cantidad += $valor['cantidad'];
                $cantidadreal += $valor['cantidad_real'];
            }
            if (array_key_exists($index, $total)) {
                $resultado[] = [
                    'denominacion' => 'Subtotal', 'valores' => '', 'cantidad' => $cantidad, 'preparacion' => '',
                    'salario' => '', 'cantidad_real' => $cantidadreal, 'total' => 1];
                $cantidad = 0;
            } else {
                $resultado[] = $valor;
            }
        }
        $resultado[] = [
            'denominacion' => 'Total', 'valores' => '', 'cantidad' => $totales, 'preparacion' => '', 'salario' => '',
            'cantidad_real' => $totalesReales, 'total' => 1];
        return $resultado;
    }

    /**
     * Funcion para imprimir
     *
     * @param $array
     */
    static function msg($array)
    {
        print_r('<pre>');
        print_r($array);
        die;
    }

    /**
     * Obtiene el valor mediante el key
     *
     * @param $array
     * @param $campo
     *
     * @return array
     */
    static function getArrayByField($array, $campo)
    {
        $resultado = [];
        foreach ($array as $valor) {
            $resultado[] = $valor[$campo];
        }
        return $resultado;
    }

    /**
     * Función para convertir la fecha
     *
     * @param $fecha
     *
     * @return string
     */
    static function convertirFecha($fecha)
    {
        $fecha = explode('/', $fecha);
        $dia = intval($fecha[0]);
        $mes = Util::getMonth($fecha[1]);
        $ano = intval($fecha[2]);
        return $dia . ' de ' . $mes . ' del ' . $ano;
    }

    /**
     * @param $number
     *
     * @return mixed
     */
    static function getMonth($number)
    {
        $number = intval($number) - 1;
        $meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre',
            'Noviembre', 'Diciembre',];
        return $meses[$number];
    }

    /**
     * Función par construir árbol
     *
     * @param $valores
     *
     * @return array
     */
    static function construirArbol($valores)
    {
        $arbol = [];
        $ids = [];
        foreach ($valores as $estructura) {
            if (!Util::existeNodo($ids, $estructura['id'])) {
                $ids [] = $estructura['id'];
                $resp = Util::buscarHijosNodo($ids, $valores, $estructura);
                $ids = $resp['ids'];
                $estructura['children'] = $resp['hijos'];
                array_push($arbol, $estructura);
            }
        }
        return $arbol;
    }

    /**
     * verifica si existe el nodo
     *
     * @param $lista
     * @param $id
     *
     * @return bool
     */
    static function existeNodo($lista, $id)
    {
        foreach ($lista as $val) {
            if ($val == $id) {
                return TRUE;
            }
        }
        return FALSE;
    }

    /**
     * Buscar hijos del nodo
     *
     * @param $ids
     * @param $lista
     * @param $valor
     *
     * @return array
     */
    static function buscarHijosNodo($ids, $lista, $valor)
    {
        if ($valor['leaf']) {
            return ['ids' => $ids, 'hijos' => FALSE];
        }
        $hijos = [];
        foreach ($lista as $hijo) {
            if ($hijo['idpadre'] == $valor['id'] && $hijo['id'] != $valor['id'] && !Util::existeNodo($ids, $hijo['id'])
            ) {
                $ids [] = $hijo['id'];
                $resp = Util::buscarHijosNodo($ids, $lista, $hijo);
                $ids = $resp['ids'];
                $hijo ['children'] = $resp['hijos'];
                array_push($hijos, $hijo);
            }
        }
        return ['ids' => $ids, 'hijos' => $hijos];
    }

    /**
     * Eliminar de un arreglo
     *
     * @param        $data
     * @param        $search
     * @param string $fieldSearch
     *
     * @return array}
     */
    static function deleteInArray($data, $search, $fieldSearch = 'id')
    {
        $result = [];
        foreach ($data as $element) {
            if ($element[$fieldSearch] != $search) {
                $result[] = $element;
            }
        }
        return $result;
    }

    /**
     * Para buscar el los reportes gráficos
     *
     * @param        $data
     * @param        $limit
     * @param        $start
     * @param string $search
     * @param string $fieldSearch
     *
     * @return array
     */
    static function getGridData($data, $limit, $start, $search = '', $fieldSearch = 'denominacion')
    {
        $result = [];
        foreach ($data as $index => $element) {
            $count = count($result);
            if ($count < $limit && $index >= $start) {
                if ($search) {
                    $text = Util::fixTitle($element[$fieldSearch]);
                    $search = Util::fixTitle($search);
                    $searching = explode($search, $text);
                    if (count($searching) > 1) {
                        $result[] = $element;
                    }
                } else {
                    $result[] = $element;
                }
            }
        }
        return $result;
    }

    /**
     * @param $includeMilitares
     * @param $cargos
     * @param $temporal
     * @param $tablaCargos
     *
     * @return array
     */
    private static function flagTemporal($includeMilitares, $cargos, $temporal, $tablaCargos)
    {
        $temporal['id'] = $cargos['id'];
        $temporal['idconcepto'] = $cargos['idconcepto'];
        $temporal['text'] = $cargos['denominacion'];
        $temporal['civil'] = $cargos['civil'];
        if ($cargos['idcategocup'] != '') {
            $temporal['cantidadCivil'] = $cargos['cantidad'];
            $temporal['cantidadMilitar'] = 0;
        } else {
            $temporal['cantidadMilitar'] = $cargos['cantidad'];
            $temporal['cantidadCivil'] = 0;
        }
        $temporal['tipomedio'] = $cargos['tipomedio'];
        if ($cargos['idcategocup'] != '') {
            $tablaCargos[] = $temporal;
            return [$temporal, $tablaCargos];
        } else {
            if ($includeMilitares) {
                $tablaCargos[] = $temporal;
                return [$temporal, $tablaCargos];
            }
            return [$temporal, $tablaCargos];
        }
    }

    /**
     * @param $datosReales
     * @param $cargo
     * @param $pos
     * @param $existeId
     *
     * @return array
     */
    private static function getDatos(&$datosReales, &$cargo, &$pos, &$existeId)
    {
        if (is_bool($pos)) {
            if (!$existeId) {
                $datosReales [] = $cargo;
                return $datosReales;
            } else {
                $datosReales [] = ['cantidad' => $cargo['cantidad']];
                return $datosReales;
            }
        } else {
            /** @noinspection PhpIllegalArrayKeyTypeInspection */
            $datosReales[$pos]['cantidad'] += $cargo['cantidad'];
            return $datosReales;
        }
    }

    /**
     * @param $datosReales
     * @param $medio
     * @param $pos
     * @param $existeId
     *
     * @return array
     */
    private static function getDatosM(&$datosReales, &$medio, &$pos, &$existeId)
    {
        if (is_bool($pos)) {
            if (!$existeId) {
                $datosReales [] = $medio;
                return $datosReales;
            } else {
                $datosReales [] = ['cantidad' => $medio['cantidad']];
                return $datosReales;
            }
        } else {
            /** @noinspection PhpIllegalArrayKeyTypeInspection */
            $datosReales[$pos]['cantidad'] += $medio['cantidad'];
            return $datosReales;
        }
    }

    /**
     * @param $cargo
     * @param $existeId
     * @param $totalOrgano
     *
     * @param $isParent
     *
     * @return array
     */
    private static function asingTotalCargo(&$cargo, &$existeId, $totalOrgano, $isParent)
    {
        if ($existeId) {
            $isParent = TRUE;
            return array($isParent, $totalOrgano);
        } else {
            $totalOrgano += $cargo['cantidad'];
            return array($isParent, $totalOrgano);
        }
    }

    /**
     * @param $existeId
     * @param $medio
     * @param $totalOrgano
     *
     * @param $isParent
     *
     * @return array
     */
    private static function assignTotalMedio(&$existeId, &$medio, $totalOrgano, $isParent)
    {
        if ($existeId) {
            $isParent = TRUE;
            return array($isParent, $totalOrgano);
        } else {
            $totalOrgano += $medio['cantidad'];
            return array($isParent, $totalOrgano);
        }
    }

    /**
     * @param $tc
     * @param $cargos
     * @param $tablaCargos
     * @param $index
     *
     * @return bool
     */
    private static function assingCantidadesCargos($tc, $cargos, $tablaCargos, $index)
    {
        $flag = FALSE;
        if ($tc['text'] == $cargos['denominacion']) {
            if ($cargos['idcategocup'] != '') {
                $tablaCargos[$index]['cantidadCivil'] += $cargos['cantidad'];
            } else {
                $tablaCargos[$index]['cantidadMilitar'] += $cargos['cantidad'];
            }
            $flag = TRUE;
            return $flag;
        }
        return $flag;
    }

    static function existeIdNodo($lista, $id)
    {
        foreach ($lista as $val) {
            if ($val == $id) {
                return true;
            }
        }

        return false;
    }
}