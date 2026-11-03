<?php

/**
 * @class      DatEstructuraubicacionModel *
 * @package    Inventario
 * @subpackage Configuracion ubicacion
 * @author     Antonio Diaz Soutuyo
 * @version    1.0
 */
class DatEstructuraubicacionModel extends ZendExt_Model
{
    private $objEstructuraUbicacion;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->objEstructuraUbicacion = new DatEstructuraubicacion();
    }

    /**
     * Funcion para obtener estructuras de ubicacion por el iddeposito
     *
     * @author Antonio Diaz Soutuyo
     * @return Retorna estructuras de ubicacion
     */
    public function ObtenerEstructurasUbicacion($idestructuraubicacion, $nivel = 0, $ultimoNivelMostrar = -1, $dql = false)
    {
        // (CASE WHEN ($nivel = deu.nivel) THEN (TRUE) ELSE FALSE END) as leaf,
        //Se quieto esta linea de la consulta porque estaba devolviendo mal la variale leaf, necesaria en la vista
        $query = Doctrine_Query::create();
        $query->select(
                "deu.idestructuraubicacion, deu.idestructuraubicacion AS id, deu.idtipoubicacion AS idtipoubicacion, "
                . "(deu.codigo || '-' || deu.descripcion) AS text, dai.ubicacionarea AS ubicacion, "
                . "da.idformato AS idformato, dai.idnomtipoarea AS idnomtipoarea, da.idarea AS idarea, "
                . "(CASE WHEN (deu.ordender - deu.ordenizq = 1 ) THEN 1 ELSE 0 END) as leaf, deu.nivel AS nivel"
            )
            ->from('DatEstructuraubicacion deu')
            ->leftJoin('deu.DatArea da')
            ->leftJoin('da.DatAreainventario dai')
            ->leftJoin('deu.DatValorescampostipoubicacion dv')
            ->where('da.idestructuracomun = ? AND deu.idpadre = deu.idestructuraubicacion', $idestructuraubicacion)
            ->addWhere('(deu.idtipoubicacion != -1 OR deu.idtipoubicacion is null)')
            ->orWhere('deu.idpadre = ? AND deu.idpadre <> deu.idestructuraubicacion', $idestructuraubicacion)
            ->orderBy('deu.idestructuraubicacion');
        if ($ultimoNivelMostrar != -1) {
            $query->addWhere('deu.nivel <= ?', array($ultimoNivelMostrar));
        }
        if ($dql) {
            return $query;
        }
        $ubicaciones = $query->fetchArray();
        $configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        foreach ($ubicaciones as $key => $value) {
            $partes = $configuracionHelper->BuscarParteFormato($value['idformato']);
            $ubicaciones[$key]['ultimonivel'] = count($partes) == $value['nivel'];
        }
        return $ubicaciones;
    }

    /**
     * Devuelve las estructura de ubicacion que son hojas.
     * @param numeric $iddeposito
     * @return array
     */
    public function obtenerUltimoNivelDeposito($iddeposito)
    {
        $conn = Doctrine_Manager:: connection();
        $sql
            = "Select eu.idestructuraubicacion, eu.descripcion
                From mod_logubicacion.dat_area a 
                inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idarea = a.idarea 
                           and eu.ordender - eu.ordenizq = 1 
                Where a.idestructuracomun = {$iddeposito}";
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * Devuelve los datos de la estructura por su id
     * @param numeric $idestructuraubicacion
     * @return array
     */
    public function obtenerEstructura($idestructuraubicacion)
    {
        $query = $this->objEstructuraUbicacion->obtenerEstructura($idestructuraubicacion, true);
        $configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'vc', 'um', 'um.denominacionunidadmedida AS umedida', 'leftJoin'
        );
        $datos = $query->fetchArray();
        $datos[0]['tieneHijos'] = 0;
        if ($this->objEstructuraUbicacion->getHijos($idestructuraubicacion, true)->count() > 0) {
            $datos[0]['tieneHijos'] = 1;
        }
        return $datos;
    }

    /**
     * Funcion para adicionar estructura
     *
     * @author Antonio Diaz Soutuyo
     * @return Retorna true si se adiciona correctamente
     */
    public function adicionarEstructura($datos)
    {
//        if ($datos['dimensiones']) {
//            $sql = "mod_logubicacion.funcion(parametros)";
//            Doctrine_Manager::connection()->fetchAll($sql);
//        }
        $obj = $this->existeUbicacion($datos);
        if ($obj['existe']) {
            return array('success' => false, 'codError' => $obj['esarea'] ? 2 : 6);
        }
        if ($datos['largo'] > 0 && $datos['ancho'] > 0 && $datos['alto'] > 0) {
            if (!$this->verificarVolumen($datos)) {
                return array('success' => false, 'codError' => 3);
            }
        }
        if ($datos['peso'] > 0) {
            if (!$this->verificarPeso($datos)) {
                return array('success' => false, 'codError' => 4);
            }
        }
        if ($datos['capacidad'] > 0) {
            if (!$this->verificarCapacidadGeneral($datos)) {
                return array('success' => false, 'codError' => 5);
            }
        }
        $area = $this->inicializarEstructura($datos);
        $area->save();
        if (!$datos['ubicacionarea'] && $datos['idestructuraubicacion']) {
            Doctrine_Query::create()->delete('DatValorescampostipoubicacion')
                ->where('idestructuraubicacion = ? ', $datos['idestructuraubicacion'])
                ->execute();
        }
        return array('success' => true);
    }

    /**
     * Funcion para eliminar areas
     *
     * @author Antonio Diaz Soutuyo
     * @return Retorna true si se elimina correctamente
     */
    public function eliminarArea($idestructuraubicacion)
    {
        $estructuraubicacion = Doctrine:: getTable('DatEstructuraubicacion')
            ->find($idestructuraubicacion);
        $estructuraubicacion = $estructuraubicacion->toArray();
        try {
            Doctrine_Query::create()->delete()->from('DatArea')
                ->where('idarea = ? ', array($estructuraubicacion['idarea']))
                ->execute();
        } catch (Exception $e) {
            return false;
        }
        return true;
    }

    /**
     * Funcion para eliminar estructuras
     *
     * @author Antonio Diaz Soutuyo
     * @return Retorna true si se elimina correctamente
     */
    public function eliminarEstructura($idestructuraubicacion)
    {
        try {
            Doctrine_Query::create()->delete()->from('DatEstructuraubicacion')
                ->where('idestructuraubicacion = ? ', array($idestructuraubicacion))
                ->execute();
        } catch (Exception $e) {
            return false;
        }
        return true;
    }

    /**
     * Inicializa la estructura de ubicacion.
     * @param array $datos
     * @return Doctrine_Record
     */
    public function inicializarEstructura($datos)
    {
        $area = new DatArea();
        $areaInventario = new DatAreainventario();
        if ($datos['idarea']) {
            $area->assignIdentifier($datos['idarea']);
            $areaInventario->assignIdentifier($datos['idarea']);
        }
        $area->synchronizeWithArray($datos);
        $areaInventario->synchronizeWithArray($datos);
        $area->DatAreainventario = $areaInventario;
        $ubicacion = new DatEstructuraubicacion();
        if ($datos['idestructuraubicacion']) {
            $ubicacion->assignIdentifier($datos['idestructuraubicacion']);
        }
        $ubicacion->synchronizeWithArray($datos);
        if ($datos['ubicacionarea']) {
            $valores = new DatValorescampostipoubicacion();
            if ($datos['idestructuraubicacion'] && $valores->existenCampos($datos['idestructuraubicacion'])) {
                $valores->assignIdentifier($datos['idestructuraubicacion']);
            }
            $valores->synchronizeWithArray($datos);
            $ubicacion->DatValorescampostipoubicacion = $valores;
        }
        $area->DatEstructuraubicacion[] = $ubicacion;
        return $area;
    }

    /**
     * Verifica si existe la ubicacion.
     * @param array $datos
     * @return array
     */
    public function existeUbicacion($datos)
    {
        $query = Doctrine_Query::create()
            ->select(
                'eu.idestructuraubicacion, eu.idpadre, a.idestructuracomun AS idestructuracomun,'
                . '(eu.idpadre = eu.idestructuraubicacion) AS esarea'
            )
            ->from('DatEstructuraubicacion eu')
            ->innerJoin('eu.DatArea a')
            ->where(
                '(eu.codigo = ? OR eu.descripcion = ?) '
                . 'AND ((eu.idpadre = ? AND eu.idestructuraubicacion <> eu.idpadre) '
                . 'OR (a.idestructuracomun = ? AND eu.idpadre = eu.idestructuraubicacion))',
                array($datos['codigo'], $datos['descripcion'], $datos['idpadre'], $datos['idestructuracomun'])
            )
            ->orderBy('eu.idestructuraubicacion');
        if ($datos['idestructuraubicacion']) {
            $query->addWhere('eu.idestructuraubicacion <> ?', $datos['idestructuraubicacion']);
        }
        $ubicacion = $query->fetchArray();
        return array('esarea' => $ubicacion[0]['esarea'], 'existe' => count($ubicacion) > 0);
    }

    /**
     * Método para  cargar los productos en la interfaz propuesta de ubicación
     *
     * @param type $param
     *
     * @author Yoandi Díaz Ramos
     * @return array
     */
    public function cargarPUbicaciones($param)
    {
        $ubicaciones = array();
        $ubicaciones = $this->cargarUbicacionesExistencia($param);
        $cantidad = $param['cantidad'];
        foreach ($ubicaciones as $key => $value) {
            $pubicacion = $this->determinarCantidadUbicar(
                $value, $cantidad, $param['idproducto']
            );
            $ubicaciones[$key]['pubicacion'] = $pubicacion;
            $cantidad = $cantidad - $pubicacion;
            if (($cantidad) <= 0) {
                break;
            }
        }
        foreach ($ubicaciones as $key => $value) {
            $area = $this->objEstructuraUbicacion->dameAreaByEstructura($value['idarea']);
            $ubicaciones[$key]['area'] = $area[0]['descripcion'];
        }
        return array('cantidad' => count($ubicaciones), 'datos' => $ubicaciones);
    }

    /**
     * Método para  cargar las ubicaciones existentes
     *
     * @param type $param
     *
     * @author Yoandi Díaz Ramos
     * @return array
     */
    public function cargarUbicacionesExistencia($param)
    {
        $datos = $this->objEstructuraUbicacion->cargarUbicacionesExistencia($param['idproducto']);
        return $datos;
    }

    /**
     * Método para determinar la cantidad a ubicar en cada ubicación
     *
     * @param type $ubicaciones and $cantidad and $idproducto
     *
     * @author Yoandi Díaz Ramos
     * @return array
     */
    public function determinarCantidadUbicar($ubicaciones, $cantidad, $idproducto)
    {
        $estructura = new DatEstructuraubicacionModel();
        $campostipoubicacion = new DatValorescampostipoubicacion();
        $parametros = $estructura->devolverParametrosUbicacion($ubicaciones['idestructuraubicacion']);
        if ($parametros[0]['capacidad'] == 1) {
            $total = $campostipoubicacion->getCapacidadTotal($ubicaciones['idestructuraubicacion']);
            $valor = $this->objEstructuraUbicacion->estadoCapacidad($ubicaciones['idestructuraubicacion']);
            if (($valor[0]['sum'] + $cantidad) <= $total[0]['capacidad']) {
                return $cantidad;
            } else {
                $diferencia = $total[0]['capacidad'] - $valor[0]['sum'];
                return $diferencia;
            }
        } else {
            if ($parametros[0]['volumen'] == 1) {
                $valor = $this->objEstructuraUbicacion->estadoVolumen($ubicaciones['idestructuraubicacion']);
                foreach ($valor as $key => $value) {
                    if ($value['largo'] == 0 || $value['alto'] == 0 || $value['ancho'] == 0) {
                        return false;
                    }
                    $suma += ($value['largo'] * $value['alto'] * $value['ancho']) * $value['cantidad'];
                }
                $total = $campostipoubicacion->getVolumenTotal($ubicaciones['idestructuraubicacion']);
                $volumen = $this->objEstructuraUbicacion->calcularVolumen($idproducto);
                if (($suma + ($volumen[0]['volumen'] * $cantidad)) <= $total[0]['volumen']) {
                    return $cantidad;
                } else {
                    $diferencia = ($total[0]['volumen'] - $suma) / $volumen[0]['volumen'];
                    return $diferencia;
                }
            } else {
                if ($parametros[0]['peso'] == 1) {
                    $valor = $this->objEstructuraUbicacion->estadoPeso($ubicaciones['idestructuraubicacion']);
                    foreach ($valor as $key => $value) {
                        if ($value['peso'] == 0) {
                            return false;
                        }
                        $suma += ($value['peso']) * $value['cantidad'];
                    }
                    $total = $campostipoubicacion->getPesoTotal($ubicaciones['idestructuraubicacion']);
                    $peso = $this->objEstructuraUbicacion->calcularPeso($idproducto);
                    if (($suma + ($peso[0]['peso'] * $cantidad)) <= $total[0]['peso']) {
                        return $cantidad;
                    } else {
                        $diferencia = ($total[0]['peso'] - $suma) / $peso[0]['peso'];
                        return $diferencia;
                    }
                }
            }
        }
        return 0;
    }

    /**
     * Método para validar el producto en caso de que sea único
     *
     * @param type $idestructuraubicacion and $idproducto
     *
     * @author Yoandi Díaz Ramos
     * @return array
     */
    public function validarProducto($idestructuraubicacion, $idindicador)
    {
        $valor = $this->objEstructuraUbicacion->validarProducto($idestructuraubicacion, $idindicador);
        return $valor;
    }

    public function devolverNivel($idestructura)
    {
        return $this->objEstructuraUbicacion->devolverNivel($idestructura);
    }

    /**
     * Verifica si el nuevo volumen no sobrepasa el volumen definido en la ubicacion superior.
     * @param array $datos
     * @return boolean
     */
    public function verificarVolumen($datos)
    {
        if ($datos['idestructuraubicacion'] != $datos['idpadre']) {
            $padre = Doctrine::getTable('DatValorescampostipoubicacion')->find($datos['idpadre']);
        }
        $query = $this->objEstructuraUbicacion->getHijos($datos['idpadre'], true);
        if ($datos['idestructuraubicacion']) {
            $query->addWhere('eu.idestructuraubicacion <> ?', $datos['idestructuraubicacion']);
        }
        $hijos = $query->fetchArray();
        $ancho = $datos['ancho'];
        $alto = $datos['alto'];
        $largo = $datos['largo'];
        foreach ($hijos as $value) {
            $partes = Doctrine::getTable('DatValorescampostipoubicacion')->find($value['idestructuraubicacion']);
            $ancho += (float) $partes->ancho;
            $alto += (float) $partes->alto;
            $largo += (float) $partes->largo;
        }
        if ($padre && ($ancho > $padre->ancho || $alto > $padre->alto || $largo > $padre->largo)) {
            return false;
        }
        return true;
    }

    /**
     * Verifica si el nuevo peso no sobrepasa el peso definido en la ubicacion superior.
     * @param array $datos
     * @return boolean
     */
    public function verificarPeso($datos)
    {
        if ($datos['idestructuraubicacion'] != $datos['idpadre']) {
            $padre = Doctrine::getTable('DatValorescampostipoubicacion')->find($datos['idpadre']);
        }
        $query = $this->objEstructuraUbicacion->getHijos($datos['idpadre'], true);
        if ($datos['idestructuraubicacion']) {
            $query->addWhere('eu.idestructuraubicacion <> ?', $datos['idestructuraubicacion']);
        }
        $hijos = $query->fetchArray();
        $peso = (float) $datos['peso'];
        foreach ($hijos as $value) {
            $valor = Doctrine::getTable('DatValorescampostipoubicacion')->find($value['idestructuraubicacion']);
            $peso += $valor->peso;
        }
        if ($padre->peso && $peso > $padre->peso) {
            return false;
        }
        return true;
    }

    /**
     * Verifica si la nueva capacidad no sobrepasa la capacidad definida en la ubicacion superior.
     * @param array $datos
     * @return boolean
     */
    public function verificarCapacidadGeneral($datos)
    {
        if ($datos['idestructuraubicacion'] != $datos['idpadre']) {
            $padre = Doctrine::getTable('DatValorescampostipoubicacion')->find($datos['idpadre']);
        }
        $query = $this->objEstructuraUbicacion->getHijos($datos['idpadre'], true);
        if ($datos['idestructuraubicacion']) {
            $query->addWhere('eu.idestructuraubicacion <> ?', $datos['idestructuraubicacion']);
        }
        $hijos = $query->fetchArray();
        $capacidad = (float) $datos['capacidad'];
        foreach ($hijos as $value) {
            $cap = Doctrine::getTable('DatValorescampostipoubicacion')->find($value['idestructuraubicacion']);
            $capacidad += $cap->capacidad;
        }
        if ($padre->capacidad && $capacidad > $padre->capacidad) {
            return false;
        }
        return true;
    }

    public function dameCamino($idestructuraubicacion, $idpadre)
    {
        if ($idestructuraubicacion == $idpadre) {
            $estructura = Doctrine:: getTable('DatEstructuraubicacion')->find($idestructuraubicacion);
            $camino = $estructura->descripcion;
        } else {
            $camino = Doctrine:: getTable('DatEstructuraubicacion')->find($idestructuraubicacion)->descripcion;
            while ($idestructuraubicacion != $idpadre) {
                $estructura = Doctrine:: getTable('DatEstructuraubicacion')->find($idpadre);
                $camino = $estructura->descripcion . '/' . $camino;
                $idestructuraubicacion = $estructura->idestructuraubicacion;
                $idpadre = $estructura->idpadre;
            }
        }
        return $camino;
    }

    /**
     * Devolve los parametros de la ubicacion.
     * @param numeric $idestructuraubicacion
     * @return array
     */
    public function devolverParametrosUbicacion($idestructuraubicacion)
    {
        return $this->objEstructuraUbicacion->getValoresAControlar($idestructuraubicacion);
    }

    /**
     * Método para comprobar el vólumen de la ubicacion
     *
     * @param type $idestructuraubicacion es el id de la estructura ubicación
     * @param type $cantidad              cantidad ubicada del producto
     * @param type $idproducto            es el identificador del prooducto
     *
     * @author Yoandi Díaz Ramos
     * @return 1:0
     */
    public function dameVolumen($estructura, $cantidad, $idproducto)
    {
        $campostipoubicacion = new DatValorescampostipoubicacion();
        $valor = $this->objEstructuraUbicacion->estadoVolumen($estructura);
        foreach ($valor as $key => $value) {
            if ($value['largo'] == 0 || $value['alto'] == 0 || $value['ancho'] == 0) {
                return false;
            }
            $suma += ($value['largo'] * $value['alto'] * $value['ancho']) * $value['cantidad'];
        }
        $total = $campostipoubicacion->getVolumenTotal($estructura);
        $volumen = $this->objEstructuraUbicacion->calcularVolumen($idproducto);
        if ((($suma + $volumen[0]['volumen'] * $cantidad)) <= $total[0]['volumen']) {
            return 1;
        }
        return 0;
    }

    /**
     * Método para comprobar el vólumen de la ubicacion
     *
     * @param type $idestructuraubicacion es el id de la estructura ubicación
     * @param type $cantidad              cantidad ubicada del producto
     * @param type $idproducto            es el identificador del prooducto
     *
     * @author Yoandi Díaz Ramos
     * @return 1:0
     */
    public function damePeso($estructura, $cantidad, $idproducto)
    {
        $campostipoubicacion = new DatValorescampostipoubicacion();
        $valor = $this->objEstructuraUbicacion->estadoPeso($estructura);
        foreach ($valor as $key => $value) {

            if ($value['peso'] == 0) {
                return false;
            }
            $suma += ($value['peso']) * $value['cantidad'];
        }
        $total = $campostipoubicacion->getPesoTotal($estructura);
        $peso = $this->objEstructuraUbicacion->calcularPeso($idproducto);
        if ((($suma + $peso[0]['peso'] * $cantidad)) <= $total[0]['peso']) {
            return 1;
        }
        return 0;
    }

    /**
     * Método para comprobar la capacidad de la estructura de Ubicación
     *
     * @param type $estructura es el id de la estructura ubicación
     * @param type $cantidad   cantidad ubicada del producto
     *
     * @author Yoandi Díaz Ramos
     * @return 1:0
     */
    public function dameCapacidad($estructura, $cantidad)
    {
        $campostipoubicacion = new DatValorescampostipoubicacion();
        $valor = $this->objEstructuraUbicacion->estadoCapacidad($estructura);
        $total = $campostipoubicacion->getCapacidadTotal($estructura);
        if (($valor[0]['sum'] + $cantidad) <= $total[0]['capacidad']) {
            return 1;
        }
        return 0;
    }

    public function verificarEliminarArea($idestructuraubicacion)
    {
        //$area = $this->objEstructuraUbicacion->getIdAreaXIdEstructura($idestructuraubicacion);
        $movimiento = new DatMovubicacionModel();
        $ubicaciones = $movimiento->devolverEstructuras(array('idestructuraubicacion'=>$idestructuraubicacion));
        if (count($ubicaciones)) {
            return -1;
        }
        /*foreach ($ubicaciones as $value) {
            $aux = $this->objEstructuraUbicacion->getIdAreaXIdEstructura($value['idestructuraubicacion']);
            if ($aux == $area) {
                return -1;
            }
        }*/
        return 1;
    }

    public function verificarEliminarUbicacion($idestructuraubicacion)
    {
        $movimiento = new DatMovubicacionModel();
        $ubicaciones = $movimiento->devolverEstructuras();
        foreach ($ubicaciones as $value) {
            if ($value['idestructuraubicacion'] == $idestructuraubicacion) {
                return -1;
            }
        }
        return 1;
    }

    public function salvarConfiguracion($datos = array())
    {
        $cfgUbicacion = new Datconfigubicacion();
        $datos['estrategiasalida'] = $datos['no'];
        $datos['capacidad'] = $datos['capacidad'] ? 1 : 0;
        $datos['operaciones'] = $datos['operaciones'] ? 1 : 0;
        $datos['producto'] = $datos['producto'] ? 1 : 0;
        $datos['volumen'] = $datos['volumen'] ? 1 : 0;
        $datos['peso'] = $datos['peso'] ? 1 : 0;
        $datos['estructura'] = $datos['estructura'] ? 1 : 0;
        if ($cfgUbicacion->existeConfiguracion($datos['idconfigubicacion'])) {
            $cfgUbicacion->assignIdentifier($datos['idconfigubicacion']);
        }
        $cfgUbicacion->synchronizeWithArray($datos);
        $cfgUbicacion->save();
        return true;
    }

    public function devolverConfiguracion($identidad)
    {
        $cfgUbicacion = new Datconfigubicacion();
        return $cfgUbicacion->cargarDatos($identidad);
    }

    /**
     * Método para comprobar el estado de la ubicacion
     *
     * @param type $idestructuraubicacion es el id de la estructura ubicación
     * @param type $cantidad              cantidad ubicada del producto
     * @param type $promedio
     *
     * @author Yoandi Díaz Ramos
     * @return 1:0
     */
    public function getEstadoUbicacion($idestructuraubicacion)
    {
        $valores = $this->devolverParametrosUbicacion($idestructuraubicacion);
        $estado = array();
        if ($valores[0]['capacidad'] == 1) {
            $estado['capacidad'] = $this->calcularEstadoCapacidad($idestructuraubicacion);
        }
        if ($valores[0]['volumen'] == 1) {
            $estado['volumen'] = $this->calcularEstadoVolumen($idestructuraubicacion);
        }
        if ($valores[0]['peso'] == 1) {
            $estado['peso'] = $this->calcularEstadoPeso($idestructuraubicacion);
        }
        return $estado;
    }

    /**
     * Método para obtener los datos del arobol  si no estas en el ultimo nivel del mismo.
     *
     * @param type $idestructuraubicacion
     *
     * @author Yoandi Díaz Ramos
     * @return array
     */
    public function getDatosArbol($idestructuraubicacion)
    {
        return $this->objEstructuraUbicacion->getDatosArbol($idestructuraubicacion);
    }

    /**
     * Método para calcular el estado de la capacidad de la ubicación
     *
     * @param type $idestructuraubicacion es el id de la estructura ubicación
     *
     * @author Yoandi Díaz Ramos
     * @return 1:0
     */
    public function calcularEstadoCapacidad($idestructuraubicacion)
    {
        $campostipoubicacion = new DatValorescampostipoubicacion();
        $valor = $this->objEstructuraUbicacion->estadoCapacidad($idestructuraubicacion);
        $total = $campostipoubicacion->getCapacidadTotal($idestructuraubicacion);
        $estado = ($valor[0]['sum']) * 100 / ($total[0]['capacidad']);
        return ($estado) ? $estado : 0;
    }

    /**
     * Método para calcular el estado del volumen de la ubicación
     *
     * @param type $idestructuraubicacion es el id de la estructura ubicación
     *
     * @author Yoandi Díaz Ramos
     * @return 1:0
     */
    public function calcularEstadoVolumen($idestructuraubicacion)
    {
        $campostipoubicacion = new DatValorescampostipoubicacion();
        $suma = 0;
        $valor = $this->objEstructuraUbicacion->estadoVolumen($idestructuraubicacion);
        if ($valor[0] == null) {
            return 0;
        }

        foreach ($valor as $value) {
            /* if ($value['largo'] == 0 || $value['alto'] == 0 || $value['ancho'] == 0) {
                 return 0;
             }*/
            $suma += ($value['largo'] * $value['alto'] * $value['ancho']) * $value['cantidad'];
        }
        $total = $campostipoubicacion->getVolumenTotal($idestructuraubicacion);

        $estado = $suma * 100 / ($total[0]['volumen']);
        return ($estado) ? $estado : 0;
    }

    /**
     * Método para calcular el estado del peso de la ubicación
     *
     * @param type $idestructuraubicacion es el id de la estructura ubicación
     *
     * @author Yoandi Díaz Ramos
     * @return 1:0
     */
    public function calcularEstadoPeso($idestructuraubicacion)
    {
        $campostipoubicacion = new DatValorescampostipoubicacion();
        $valor = $this->objEstructuraUbicacion->estadoPeso($idestructuraubicacion);
        if ($valor[0] == null) {
            return 0;
        }
        foreach ($valor as $value) {
            /* if ($value['peso'] == 0) {
                 return -1;
             }*/
            $suma += ($value['peso']) * $value['cantidad'];
        }
        $total = $campostipoubicacion->getPesoTotal($idestructuraubicacion);
        $estado = $suma * 100 / ($total[0]['peso']);
        return ($estado) ? $estado : 0;
    }

}
