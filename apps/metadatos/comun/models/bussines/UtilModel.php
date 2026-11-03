<?php

/**
 * Class UtilModel
 * Clase con funciones utiles para el proyecto
 */
class UtilModel extends ZendExt_Model
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Cambiar valor
     *
     * @param $valor
     *
     * @return int
     */
    static function getRealValue($valor)
    {
        if ($valor == 'on') {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Contruir mensaje de error para cada concepto por acción
     *
     * @param $accion
     * @param $idconcepto
     * @param $arrayConcepto
     *
     * @internal param $message
     * @return string
     */
    private static function construirMsgError($accion, $idconcepto, $arrayConcepto)
    {
        $confMsg = [
            1 => ['articulo' => " el "], 2 => ['articulo' => " la "], 3 => ['articulo' => " la "],
            4 => ['articulo' => " la "], 5 => ['articulo' => " el "], 6 => ['articulo' => " la "],
            7 => ['articulo' => " el "], 8 => ['articulo' => " la "], 9 => ['articulo' => " el "],
            10 => ['articulo' => " la "], 11 => ['articulo' => " la "], 12 => ['articulo' => " el "],
            13 => ['articulo' => " el "], 14 => ['articulo' => " la "], 15 => ['articulo' => " el "],
            16 => ['articulo' => " el "], 17 => ['articulo' => " el "], 18 => ['articulo' => " el "],
            19 => ['articulo' => " el "], 20 => ['articulo' => " la "], 21 => ['articulo' => " la "],
            22 => ['articulo' => " la "],
            23 => ['articulo' => " el "],24 => ['articulo' => " la "],25 => ['articulo' => " el "],26 => ['articulo' => " el "]];
        $articulo = "";
        foreach ($confMsg as $key => $value) {
            if ($key == $idconcepto) {
                $articulo .= $value['articulo'];
            }
        }
        $message = "Ha ocurrido un error al " . $accion . $articulo . $arrayConcepto[$idconcepto] . ".";
        return $message;
    }

    /**
     * Contruir mensaje de por acción para cada concepto
     *
     * @param $accion
     * @param $idconcepto
     * @param $arrayConcepto
     * @param $arrayGenero
     *
     * @internal param $message
     * @return string
     */
    private static function construirMsgInsertar($accion, $idconcepto, $arrayConcepto, $arrayGenero)
    {
        $confMsg = [
            1 => ['articulo' => " El ", 'genero' => 'masculino'], 2 => ['articulo' => " La ", 'genero' => 'femenino'],
            3 => ['articulo' => " La ", 'genero' => 'femenino'], 4 => ['articulo' => " La ", 'genero' => 'femenino'],
            5 => ['articulo' => " El ", 'genero' => 'masculino'], 6 => ['articulo' => " La ", 'genero' => 'femenino'],
            7 => ['articulo' => " El ", 'genero' => 'masculino'], 8 => ['articulo' => " La ", 'genero' => 'femenino'],
            9 => ['articulo' => " El ", 'genero' => 'masculino'], 10 => ['articulo' => " La ", 'genero' => 'femenino'],
            11 => ['articulo' => " La ", 'genero' => 'femenino'], 12 => ['articulo' => " El ", 'genero' => 'masculino'],
            13 => ['articulo' => " El ", 'genero' => 'masculino'], 14 => ['articulo' => " La ", 'genero' => 'femenino'],
            15 => ['articulo' => " El ", 'genero' => 'masculino'],
            16 => ['articulo' => " El ", 'genero' => 'masculino'],
            17 => ['articulo' => " El ", 'genero' => 'masculino'],
            18 => ['articulo' => " El ", 'genero' => 'masculino'],
            19 => ['articulo' => " El ", 'genero' => 'masculino'], 20 => ['articulo' => " La ", 'genero' => 'femenino'],
            21 => ['articulo' => " La ", 'genero' => 'femenino'], 22 => ['articulo' => " La ", 'genero' => 'femenino'],
            23 => ['articulo' => " El ", 'genero' => 'masculino'],24 => ['articulo' => " La ", 'genero' => 'femenino']
          ,25 => ['articulo' => " El ", 'genero' => 'masculino'],26 => ['articulo' => " El ", 'genero' => 'masculino']];
        $articulo = $genero = "";
        foreach ($confMsg as $key => $value) {
            if ($key == $idconcepto) {
                $articulo = $value['articulo'];
                $genero = $value['genero'];
            }
        }
        $message = $articulo . $arrayConcepto[$idconcepto] . " ha sido " . $arrayGenero[$accion][$genero] .
            " satisfactoriamente.";
        return $message;
    }

    /**
     * @param $alias
     * @param $b
     * @param $field
     * @param $where
     *
     * @return string
     */
    private static function assingBit($alias, $b, $field, $where)
    {
        if ($b ['data'] ['value'] == 'true') {
            $where .= " AND $alias.$field  = 1::bit";
            return $where;
        } else {
            $where .= " AND $alias.$field  = 0::bit";
            return $where;
        }
    }

    /**
     * @param $alias
     * @param $b
     * @param $field
     * @param $where
     *
     * @return string
     */
    private static function assingField($alias, $b, $field, $where)
    {
        if ($b ['data'] ['value'] == 'true') {
            $where .= " AND $alias.$field  = 1";
            return $where;
        } else {
            $where .= " AND $alias.$field  = 0";
            return $where;
        }
    }

    /**
     * Combertir BIT
     *
     * @param $valor
     *
     * @return int
     */
    function devolverBit($valor)
    {
        if ($valor) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Crear relación de Tablas
     *
     * @param $nom
     * @param $relation
     *
     * @return string
     */
    function crearSeleccion($nom, $relation)
    {
        $from = $nom;
        $tables = "";
        if (is_array($relation)) {
            $aso = [];
            foreach ($relation as $rel) {
                if (!isset($aso [$rel])) {
                    $tables .= ',' . $rel;
                }
                $aso [$rel] = TRUE;
            }
        }
        return $from . $tables;
    }

    /**
     * Construir where para busca dinámica
     *
     * @param $alias
     * @param $arregloBusqueda
     *
     * @return string
     */
    static function whereBusquedaDinamica($alias, $arregloBusqueda)
    {
        $where = " 1 = 1 ";
        if (is_array($arregloBusqueda) && isset($arregloBusqueda [0])) {
            foreach ($arregloBusqueda as $b) {
                $field = $b ['field'];
                $data = str_replace('$', '%', $b ['data'] ['value']);
                if (is_numeric($b ['data'] ['value'])) {
                    $data = ltrim($data, '\0');
                    $where .= " AND $alias.$field :: varchar LIKE '%$data%'";
                } elseif ($b ['data'] ['type'] == "boolean" &&
                    ($b ['data'] ['value'] == 'true' || $b ['data'] ['value'] == 'false')
                ) {
                    $where = self::assingBit($alias, $b, $field, $where);
                } elseif ($b ['data'] ['type'] == "integer" &&
                    ($b ['data'] ['value'] == 'true' || $b ['data'] ['value'] == 'false')
                ) {
                    $where = self::assingField($alias, $b, $field, $where);
                } elseif ($data !== '') {
                    $where .= " AND $alias.$field LIKE '%$data%'";
                }
            }
        }
        return $where;
    }

    /**
     * Construir where para busca dinámica de valores
     *
     * @param $arregloBusqueda
     * @param $campo
     *
     * @return bool
     */
    static function whereBusquedaDinamicaValores($arregloBusqueda, $campo)
    {
        $campo = strtolower($campo);
        if (is_array($arregloBusqueda) && isset($arregloBusqueda [0])) {
            foreach ($arregloBusqueda as $b) {
                $criterio = $b ['data'] ['value'];
                $criterio = strtolower($criterio);
                $fin = (is_numeric(strpos($criterio, '$'))) ? (strpos($criterio, '$') == 0) ? TRUE : FALSE : FALSE;
                $ini = (is_numeric(strrpos($criterio, '$')) ? (strrpos($criterio, '$') ==
                    (strlen($criterio) - 1)) ? TRUE : FALSE : FALSE);
                $criterio = str_replace('$', '', $criterio);
                if ($ini && $fin) { /*^*/
                    /*CONTENGA LA EXPRESION*/
                    if (is_numeric(strpos($campo, $criterio))) {
                        return TRUE;
                    }
                } else {
                    if ($ini) {
                        /*EMPIEZA CON LA EXPRESION*/
                        if (preg_match("^$criterio", $campo)) {
                            return TRUE;
                        }
                    } else {
                        if ($fin) {
                            /*FINALICE CON LA EXPRESION*/
                            if (preg_match("$criterio$", $campo)) {
                                return TRUE;
                            }
                        } else {
                            /*ESTRICTAMENTE IGUAL*/
                            if (!strcmp("$criterio", $campo)) {
                                return TRUE;
                            }
                        }
                    }
                }
                return FALSE;
            }
        }
        return TRUE;
    }

    /**
     * Función para construir los mensajes de la acciones los conceptos
     *
     * @param      $accion
     * @param      $idconcepto
     * @param bool $error
     *
     * @return string
     */
    static function getMessage($accion, $idconcepto, $error = FALSE)
    {
        $arrayGenero = [
            'insertar' => ['masculino' => 'adicionado', 'femenino' => 'adicionada'],
            'modificar' => ['masculino' => 'modificado', 'femenino' => 'modificada'],
            'eliminar' => ['masculino' => 'eliminado', 'femenino' => 'eliminada'],
            'georeferenciar' => ['masculino' => 'georeferenciado', 'femenino' => 'georeferenciada'],
            'desactivar' => ['masculino' => 'desactivado', 'femenino' => 'desactivada'],
            'activar' => ['masculino' => 'activado', 'femenino' => 'activada']];
        $arrayEstructura = [
            1 => 'órgano', 2 => 'agrupación', 3 => 'entidad', 4 => 'organización', 5 => 'órgano interno',
            6 => 'agrupación interna', 7 => 'cargo', 8 => 'estructura no formal', 9 => 'medio'];
        if ($error) {
            $message = self::construirMsgError($accion, $idconcepto, $arrayEstructura);
        } else {
            $message = self::construirMsgInsertar($accion, $idconcepto, $arrayEstructura, $arrayGenero);
        }
        return $message;
    }

    /**
     * Función para construir los mensajes de la acciones los nomencladores
     *
     * @param      $accion
     * @param      $idconcepto
     * @param bool $errorMensage
     *
     * @return string
     */
    static function getMensajesNomencladores($accion, $idconcepto, $errorMensage = FALSE)
    {
        $arrayGeneroNomencladores = [
            'insertar' => ['masculino' => 'adicionado', 'femenino' => 'adicionada'],
            'modificar' => ['masculino' => 'modificado', 'femenino' => 'modificada'],
            'eliminar' => ['masculino' => 'eliminado', 'femenino' => 'eliminada'],
            'georeferenciar' => ['masculino' => 'georeferenciado', 'femenino' => 'georeferenciada'],
            'desactivar' => ['masculino' => 'desactivado', 'femenino' => 'desactivada'],
            'activar' => ['masculino' => 'activado', 'femenino' => 'activada']];
        $arrayNomencladores = [
            1 => 'órgano', 2 => 'agrupación', 3 => 'entidad', 4 => 'organización', 5 => 'órgano interno',
            6 => 'agrupación interna', 7 => 'cargo', 9 => 'medio', 10 => 'subcategoría ocupacional',
            11 => 'especialidad', 12 => 'grado', 13 => 'grupo de escala', 14 => 'preparación', 15 => 'salario',
            16 => 'tipo de subordinación', 17 => 'tipo de medio', 18 => 'ícono', 19 => 'tipo de escala',
            20 => 'escala salarial', 21 => 'categoría ocupacional', 8 => 'tipo de no formales', 22 => 'firma',
            23 => 'sector',24 => 'norma jurídica',25 => 'nivel de cargo',26 => 'cargo facultado'];
        if ($errorMensage) {
            $message = self::construirMsgError($accion, $idconcepto, $arrayNomencladores);
        } else {
            $message = self::construirMsgInsertar($accion, $idconcepto, $arrayNomencladores, $arrayGeneroNomencladores);
        }
        return $message;
    }

    /**
     * @param $startDate
     * @param $endDate
     *
     * @return bool
     */
    static function check_in_range($startDate, $endDate)
    {
        $startTs = $startDate;
        $endTs = $endDate;
        $userTs = date("d/m/Y");
        if ($endTs) {
            return (($userTs >= $startTs) && ($userTs <= $endTs)) ? TRUE : FALSE;
        } else {
            return ($userTs >= $startTs) ? TRUE : FALSE;
        }
    }

    /**
     * @return bool
     */
    static function UpdateNomencladores()
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection("metadatos");
        $conn->fetchAll("Select mod_estructuracomp.f_actualizar_actual_visible()");
        return TRUE;
    }
}
