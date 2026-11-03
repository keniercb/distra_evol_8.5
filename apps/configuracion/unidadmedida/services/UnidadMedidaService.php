<?php

/**
 * Componente para gestionar las unidades de medida de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Unidadmedida/Service
 * @copyright  XETID
 * @version    1.0
 */
class UnidadMedidaService extends ZendExt_Model
{

    /**
     * Constuctor de la clase
     */
    function __constructUnidadMedidaService() 
    {
        parent::ZendExt_Model();
    }

    /**
     * Listar unidades de medida
     *
     * @param int $idmagnitud Identificador de magnitud
     * @return array Retorna un arreglo con las unidades de medida asociadas a la magnitud
     * 
     */
    function listarUnidadesMedida($idmagnitud) 
    {
        if ($idmagnitud != '0') {
            $result = $this->obtenerUnidadesMedida($idmagnitud);
        } else {
            $result = $this->obtenerMagnitudes();
        }
        $arrUM = array();
        foreach ($result as $key => $value) {
            $arrUM [$key] = $value;
            $arrUM [$key] ['text'] = empty($value ['denominacionmagnitud']) ? 
            $value ['denominacionunidadmedida'] : $value ['denominacionmagnitud'];
            if ($value ['idunidadmedida']) {
                $arrUM [$key] ['leaf'] = true;
                $arrUM [$key] ['id'] = $value ['idunidadmedida'];
                if (!empty($value['descripcionmagnitud'])) {
                    $arrUM [$key] ['qtip'] = "<div>{$value['descripcionunidadmedida']}.</div>";
                } else {
                    $arrUM [$key] ['qtip'] = "<div> </div>";
                }
            } else {
                $arrUM [$key] ['leaf'] = false;
                $arrUM [$key] ['id'] = $value ['idmagnitud'];
                if (!empty($value['descripcionmagnitud'])) {
                    $arrUM [$key] ['qtip'] = "<div>{$value['descripcionmagnitud']}.</div>";
                } else {
                    $arrUM [$key] ['qtip'] = "<div> </div>";
                }
            }
        }
        return $arrUM;
    }

    /**
     * Categoria de la unidad de medida
     *
     * @param int $idunidadmedida Identificador de unidad medida
     * @return int Retorna el identificador de categoria de la unidad de medida
     * 
     */
    function unidadMedidaCategoria($idunidadmedida) 
    {
        $temp = NomUnidadmedida::dameIdMagintud($idunidadmedida);
        $var = NomMagnitud::dameTodasUM($temp [0] [idcategoriaum]);
        return $var;
    }

    /**
     * Listar todas las unidades de medida
     *
     * @return array Retorna un arreglo con todas las unidades de medida
     * 
     */
    function listarUnidadesMedidaTodas() 
    {
        $result = NomUnidadmedida::listarUnidadMedida();
        return $result;
    }

    /**
     * Obtener magnitudes
     *
     * @return array Retorna un arreglo con todas las magnitudes
     * 
     */
    private function obtenerMagnitudes() 
    {
        $query = Doctrine_Query::create();
        $query->from('NomMagnitud m');
        $query->addWhere(
        '(Current_Date >= m.fechainicio and Current_Date < m.fechafin) or 
            (Current_Date >= m.fechainicio and m.fechafin is null)'
                );

        return $query->execute()->toArray();
    }

    /**
     * Obtener unidad de medida
     * 
     * @param int $idmagnitud Identificador de magnitud
     * @return string Retorna el nombre de la unidad de medida
     * 
     */
    public function obtenerUnidadesMedida($idmagnitud) 
    {
        try {
            $query = new Doctrine_Query();
            return $query->from('NomUnidadmedida um')
            ->where('um.idmagnitud = ?', $idmagnitud)
            ->addWhere(
            '(Current_Date >= um.fechainicio and Current_Date < um.fechafin) or 
                (Current_Date >= um.fechainicio and um.fechafin is null)'
                    )
                    ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Listar las unidades de medida tiempo
     *
     * 
     * @return array Retorna un arreglo con las unidades de medida donde uri magnitud igual a tiempo
     * @throws Doctrine_Exception $ee
     */
    public function obtenerUnidadesMedidaTiempo() 
    {
        return NomUnidadmedida::listarUnidadMedidaDadoUriMagnitud('tiempo');
    }

    /**
     * Listar las unidades de medida
     *
     * @param string $urimagnitud Uri Magnitud
     * @return array Retorna un arreglo con las unidades de medida
     * @throws Doctrine_Exception $ee
     */
    public function obtenerUnidadesMedidaDadoUriMagnitud($urimagnitud) 
    {
        return NomUnidadmedida::listarUnidadMedidaDadoUriMagnitud($urimagnitud);
    }

    /**
     * Obtener factor de conversión
     *
     * @param  int $idumorigen Identificador unidad de medida de origen
     * @param  int $idumdestino Identificador unidad de medida de destino
     * @return array Retorna un arreglo con el valor del factor de conversión
     * 
     */
    public function obtenerFactorConversion($idumorigen, $uriunidadmedida) 
    {
        $unidadmedida = NomUnidadmedida::obtenerUnidadMediaDadoUri($uriunidadmedida);
        $idumdestino = $unidadmedida->idunidadmedida;
        return NomUnidadmedida::obtenerFactorConversion($idumorigen, $idumdestino);
    }

    /**
     * Obtener factor de conversión
     *
     * @param  int $idorigen Identificador unidad de medida de origen
     * @param  int $iddestino Identificador unidad de medida de destino
     * @return array Retorna un arreglo con el valor del factor de conversión
     * 
     */
    public function obtenerFactorConversionDadoIds($idorigen, $iddestino) 
    {
        return NomUnidadmedida::obtenerFactorConversion($idorigen, $iddestino);
    }

    public function existeConversion()
    {
        $datcinversion = new DatConversion();
        return $datcinversion->existeConversion();
    }

    public function obtenerFactorBaseDadoidUmedida($idumedida)
    {
        $datcinversion = new DatConversion();
        return $datcinversion->obtenerFactorBaseDadoidUmedida($idumedida);
    }

    public function ObtenerObjetoDatConversionum()
    {
        $datcinversion = new DatConversion();
        return $datcinversion;
    }

    public function salvarDatosDatConversionum($datos)
    {	
        $datcinversion = new DatConversion();        
        return $datcinversion->salvarDatos($datos);
    }
    
    public function obtenerTodosDatosDatConversion($datos)
    {	
        $datcinversion = new DatConversion();        
        return $datcinversion->obtenerTodosDatos($datos);
    }
    
    public function eliminarDatosDatConversion($idconversion)
    {	
        $datcinversion = new DatConversion();        
        return $datcinversion->eliminarConversion($idconversion);
    }
    
    public function obtenerUMedidasConfIndicador($parametros)
    {	
        $datcinversion = new DatConversion();        
        return $datcinversion->obtenerUMedidasConfIndicador($parametros);
    }
    /**
     * Obtener unidades de medida dao un arreglo de ids
     *
     * @param  array $ids Arreglo de ids
     * @return array Retorna un arreglo de unidades de medida
     * 
     */
    function obtenerUnidadMedidaDadoId($idUM) 
    {
        $result = NomUnidadmedida::obtenerUnidadesMedidaDadoArrayId($idUM);
        return $result;
    }

    /**
     * Obtener unidad de medida con factor
     *
     * @param  int $idum Unidad de medida de origen
     * @return array Retorna un arreglo con el valor del factor de conversión y el id de la unidad de medida
     * @throws Doctrine_Exception $ee
     */
    function obtenerUnidadesMedidaConFactor($idum) 
    {
        $result = NomUnidadmedida::obtenerUnidadesMedidaConFactor($idum);
        return $result;
    }

    /**
     * Obtener el arbol de unidad de medida en un Json
     * 
     * @return string Retorna un componente js
     * 
     */
    public function getJSArbolUM() 
    {
        return '<script type="text/javascript" src="/configuracion/unidadmedida/views/js/'
        . 'arbolunidadmedida.component.js"></script>';
    }

    /**
     * Obtener los datos del arbol de la unidad de medida
     * @param int $post Posición del nodo
     * @return array Retorna un arreglo con los datos de las unidades de medida
     * 
     */
    public function getDatosArbolUM($post) 
    {
        $datos = array();
        if (!$post['node']) {
            $magnitudes = self::obtenerMagnitudes();
            foreach ($magnitudes as $key => $value) {

                $datos[$key]['id'] = $value['idmagnitud'];
                $datos[$key]['text'] = $value['denominacionmagnitud'];
                $datos[$key]['leaf'] = false;
            }
        } else {
            $unidadesmedida = self::obtenerUnidadesMedida($post['node']);
            foreach ($unidadesmedida as $key => $value) {
                $datos[$key]['id'] = $value['idunidadmedida'];
                $datos[$key]['text'] = $value['abreviaturaunidadmedida'];
                $datos[$key]['leaf'] = true;
            }
        }

        return $datos;
    }

    /**
     * Obtener la consulta unidad de medida
     * @param object $query Consulta
     * @param string $table Nombre de la tabla
     * @param string $alias_um Nombre de la unidad de medida
     * @param string $select Consulta
     * @param string $tipoJoin Tipo de unión
     * @return object Retorna el valor o los valores devueltos por la consulta
     * 
     */
    function getQueryJoinUnidadMedida($query, $table, $aliasum, $select, $tipoJoin) 
    {
        $objUm = new NomUnidadmedida();
        return $objUm->getQueryJoinUnidadMedida($query, $table, $aliasum, $select, $tipoJoin);
    }

    /**
     * Obtener el Identificador de la unidad de medida dado una abreviatura
     * 
     * @param string $alias Abreviatura de la unidad de medida
     * @return object Retorna el Identificador unidad de medida junto con su abreviatura
     * 
     */
    public function obtenerUnidadesMedidaByAbreviatura($alias) 
    {
        $result = NomUnidadmedida::obtenerIdUmByAbreviatura($alias);
        if (empty($result))
            return array();
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($result);
    }

}
