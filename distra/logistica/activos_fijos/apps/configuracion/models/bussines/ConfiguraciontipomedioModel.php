<?php

class ConfiguraciontipomedioModel extends AbstractCompositeModel
{
    protected $tipo;

    public function __construct($tipo = 0)
    {
        parent::__construct();
        $this->tipo = $tipo;
        $this->setBaseAlias('cfgtm');
        if ($tipo == 1) {
            $this->primaryKeyField = "idtipomediopatrimonio";
        } else
            $this->primaryKeyField = "idtipomedio";
    }

    /*
     * @param: concepto se refiere a si es un adicionar, un modificar o un eliminar.
     * add, mod, elim
     */

    public function gestionarTipoMedio($parametros, $concepto, $tipo)
    {
        // try {       
        if (isset($parametros['idtipomedio'])) {
            if ($tipo == 1) {
                $obj = Doctrine::getTable('CfgTipoMedioPatrimonio')->find($parametros['idtipomedio']);
                $parametros['idtipomediopatrimonio'] = $parametros['idtipomedio'];
            } else
                $obj = Doctrine::getTable('CfgTipoMedio')->find($parametros['idtipomedio']);
        }
        if (!$obj) {
            if ($tipo == 1) {
                $obj = new CfgTipoMedioPatrimonio();
            } else
                $obj = new CfgTipoMedio();
        } else {
            if (isset($parametros['idtipomedio'])) {
                $obj->assignIdentifier($parametros['idtipomedio']);
            }
        }
        $obj->synchronizeWithArray($parametros);

        if ($parametros['numserie'] == 2) {
            $obj->numchasis = 1;
        }
        if ($tipo != 1) {
            foreach ($this->listaPlugins as $plugin) {
                $plugin->beforeSave($obj, $parametros);
            }
        }

        $obj->save();
        return true;
        /* } catch (Exception $e) {            
          return false;
          } */
    }

    function cargarTiposMedios($parametros)
    {
        $datos = array();
        $proxyService = new NomgeneralesProxyService();
        /* ih.almacenado = 1 OR */
        $naturalezalezas = $proxyService->getNaturalezasAsociadasIndicadores(
            $parametros->start, $parametros->limit, 'ih.explotacion = 1', $parametros
        );

        $start = ($parametros->start ? $parametros->start : 0);
        $limit = ($parametros->limit ? $parametros->limit : 30);
        $datos['total'] = $naturalezalezas['cantidad'];

        foreach ($naturalezalezas['data'] as $naturaleza) {

            $params = array('idtipomedio' => $naturaleza['idnaturaleza'], 'tipo' => $parametros->tipo);
            if ($params['tipo'] == 1) {
                $conn = Zend_Registry::get('conexion');
                $selectData = "SELECT m.idtipomediopatrimonio AS idtipomedio, 
                    m.desctipomedio AS desctipomedio, m.numinventario AS numinventario, m.colorprim AS colorprim, 
                    m.colorsec AS colorsec, m.valorcontable AS valorcontable, m.fechaadq AS fechaadq, 
                    m.fechaexpini AS fechaexpini, m.fechaexpfin AS fechaexpfin, m.estado AS estado, 
                    m.annofabricacion AS annofabricacion, m.garantia AS garantia, m.actual AS actual, 
                    m.actividad AS actividad, m.categoria AS categoria, m.responsable AS responsable
                    
                    FROM mod_logpatrimonio.conf_tipomediopatrimonio m 
                    WHERE (m.actual = 1 AND m.idtipomediopatrimonio = {$params['idtipomedio']})";

                $start = " OFFSET($start) LIMIT($limit)";

                $dat = $conn->fetchAll($selectData);
            } else {

                $query = $this->getSelectQuery($params);             
                $dat = $query->fetchArray();
            }

            if (count($dat) == 0) {
                $arr = $this->getArrayColumnasVacias($naturaleza);
                $datos['datos'][] = $arr;
            } else {
                $datos['datos'][] = $dat[0];
            }
        }
        if (!$datos['datos']) {
            $datos['datos'] = array();
        }

        return $datos;
    }

    function columnasMuestra($datos)
    {
        $colMostrar = array();
        foreach ($datos as $value) {
            $i = 0;
            foreach ($value as $key => $value) {
                if ($value != 0) {
                    if (!$colMostrar[$i]) {
                        $colMostrar[$i] = $key;
                    }
                } else {
                    if (!$colMostrar[$i]) {
                        $colMostrar[$i] = 0;
                    }
                }
                $i++;
            }
        }
        return $colMostrar;
    }

    public function getArrayColumnasVacias($naturaleza)
    {
        $arr = array('idtipomedio' => $naturaleza['idnaturaleza'],
            'desctipomedio' => $naturaleza['denominacion'],
            'numinventario' => 0,
            'numserie' => 0,
            'colorprim' => 0,
            'colorsec' => 0,
            'valorcontable' => 0,
            'cantidadrecursoconsumido' => 0,
            'fechaadq' => 0,
            'fechaexpini' => 0,
            'fechaexpfin' => 0,
            'ubicacion' => 0,
            'estado' => 0,
            'annofabricacion' => 0,
            'garantia' => 0,
            'actual' => 0,
            'actividad' => 0,
            'categoria' => 0,
            'responsable' => 0
        );


        foreach ($this->listaPlugins as $plug) {
            $arr = $plug->getArrayColumnasVacias($arr);
        }
        return $arr;
    }

    public function initBaseModel()
    {
        // TODO: Implement initBaseModel() method.
        $this->baseModel = new CfgTipoMedio();
    }

    public function setBaseModel($baseModel)
    {
        $this->baseModel = $baseModel;
    }

    /**
     *
     */
    public function getQuerySelectFields($alias)
    {
        // TODO: Implement getQuerySelectFields() method. 

        $arrayQueryStrings = array(
            //'denominacion' => '_p.denominacion',
            'idtipomedio' => '_p.idtipomedio',
            'desctipomedio' => "_p.desctipomedio",
            'numinventario' => '_p.numinventario',
            'numserie' => '_p.numserie',
            'colorprim' => '_p.colorprim',
            'colorsec' => '_p.colorsec',
            'valorcontable' => '_p.valorcontable',
            'cantidadrecursoconsumido' => '_p.cantidadrecursoconsumido',
            'fechaadq' => '_p.fechaadq',
            'fechaexpini' => '_p.fechaexpini',
            'fechaexpfin' => '_p.fechaexpfin',
            'ubicacion' => '_p.ubicacion',
            'estado' => '_p.estado',
            'annofabricacion' => '_p.annofabricacion',
            'garantia' => '_p.garantia',
            'actual' => '_p.actual',
            'actividad' => '_p.actividad',
            'categoria' => '_p.categoria',
            'responsable' => '_p.responsable',
            
         
        );
        if ($this->tipo == 1) {
            unset($arrayQueryStrings['idtipomedio']);
            $arrayQueryStrings['idtipomediopatrimonio'] = '_p.idtipomediopatrimonio';
            //idtipomediopatrimonio
        }
        return $this->doctrineHelper->getStrSelectString($arrayQueryStrings, $alias, '_p');
    }

    /**
     *
     */
    public function addQueryFilters(Doctrine_Query $query, $aliasTabla, $parametros = array())
    {
        // TODO: Implement addQueryFilters() method.
        $query->addWhere("$aliasTabla.actual = ?", array(1));
        if ($parametros['desctipomedio']) {
            $query->addWhere(
                'cfgtm.desctipomedio = ?', array($parametros['desctipomedio'])
            );
        }
        if ($parametros['limit']) {
            $query->limit($parametros['limit']);
        }
        if ($parametros['start']) {
            $query->offset($parametros['start']);
        }
        if (strlen($parametros['idtipomedio']) > 0) {
            if ($this->tipo == 1) {
                $query->addWhere(
                    'cfgtm.idtipomediopatrimonio = ?', array($parametros['idtipomedio'])
                );
            } else {
                $query->addWhere(
                    'cfgtm.idtipomedio = ?', array($parametros['idtipomedio'])
                );
            }
        }
        if ($parametros['idtipomedio']) {
            $query->addWhere("$aliasTabla.$this->primaryKeyField = {$parametros['idtipomedio']}");
        }
    }

    public function addJoinModel(
    Doctrine_Query $query, $aliasExterno, $aliasLocal, $includeSelect = true, $parametros = array()
    )
    {
        // TODO: Implement addJoinModel() method.
    }

    public function initBaseRelation(Doctrine_Record $model)
    {
        // TODO: Implement initBaseRelation() method.
    }

    public function beforeDelete($identifier)
    {
        // TODO: Implement beforeDelete() method.
    }

    public function findTipoMedioByArrayIdes($parametros, $tipoRetorno = null)
    {

        if ($this->tipo == 1) {
            $query = $this->initBaseQuery($parametros);
        } else {        
            $query = $this->getSelectQuery($parametros);
        }       
        if ($tipoRetorno == 'obj') {
            return $query->execute();
        } else {     
            return $query->fetchArray();
        }
    }

    /**
     * @param      $parametros
     * @param null $tipoRetorno
     *
     * @return mixed
     */
    public function findTipoMedioByArrayIdesTrans($parametros, $tipoRetorno = null)
    {
        $query = $this->getSelectQuery($parametros);
        $relations[] = array('cardinalidad' => 'one', 'relation' => 'CfgTipoMedioTransp',
            'properties' => array('local' => 'idtipomedio', 'foreign' => 'idtipomediotransp'));
        LogisticaDoctrineHelper::__init()->tryInyectRelactions(new CfgTipoMedio(), $relations);
        $query->leftJoin('cfgtm.CfgTipoMedioTransp cfgtmt');
        $query->addSelect('cfgtmt.numchasis as numchasis');

        if ($tipoRetorno == 'obj') {
            return $query->execute();
        } else {
            return $query->fetchArray();
        }
    }

    public function getLabelNameObjectsFromDataIF($result, $atributo, $objConfPG)
    {
  
        if ($atributo == 'actividad' || $objConfPG[0]['depreciacion']) {
            $obj = new stdClass();
            $obj->label = 'Grupo explotaci&oacute;n';
            $obj->descripcion = 'Grupo explotaci&oacute;n';
            $obj->name = 'idactividad';
            $obj->tipo = 'combo';
            $obj->sortable = true;
            $obj->default = true;
            $obj->obligatorio = ($objConfPG[0]['depreciacion']) ? true : false;
            if (!in_array($obj, $result)) {
                array_push($result, $obj);
            }
        }
        if ($atributo == 'cantidadrecursoconsumido' || $objConfPG[0]['depreciacion']) {
            $obj = new stdClass();
            $obj->label = 'Cantidad recursos consumidos';
            $obj->sortable = true;
            $obj->name = 'cantidadrecursoconsumido';
            $obj->allowBlank = false;
            $obj->descripcion = 'Cantidad recursos consumidos';
            $obj->tipo = 'numberfield';
            $obj->default = true;
            if (!in_array($obj, $result)) {
                array_push($result, $obj);
            }
        }
        if ($atributo == 'fechaexpini' || ($objConfPG[0]['depreciacion'] && $objConfPG[0]['explotacionadquisicion'] == 1)) {
            $obj = new stdClass();
            $obj->label = 'Fecha explotaci&oacute;n inicio';
            $obj->name = 'fechaexpini';
            $obj->descripcion = 'Fecha explotación inicio';
            $obj->tipo = 'date';
            $obj->sortable = true;
            $obj->default = true;
            $obj->obligatorio = ($objConfPG[0]['explotacionadquisicion'] &&
                $objConfPG[0]['depreciacion']) ? true : false;
            if (!in_array($obj, $result)) {
                array_push($result, $obj);
            }
        }
        if (($atributo == 'fechaexpfin' ) || $objConfPG[0]['depreciacion']) {
            $obj = new stdClass();
            $obj->label = 'Fecha explotaci&oacute;n fin';
            $obj->descripcion = 'Fecha explotación fin';
            $obj->name = 'fechaexpfin';
            $obj->tipo = 'date';
            $obj->sortable = true;
            $obj->default = true;
            $obj->obligatorio = /*($objConfPG[0]['depreciacion'] && $atributo != 'fechaexpfin') ? true : */false;
            $obj->allowBlank = /*($objConfPG[0]['depreciacion'] && $atributo != 'fechaexpfin') ? false : */true;
            if (!in_array($obj, $result)) {
                array_push($result, $obj);
            }
        }
        if ($atributo == 'fechaadq' || ($objConfPG[0]['depreciacion'] && $objConfPG[0]['explotacionadquisicion'] == 0)) {
            $obj = new stdClass();
            $obj->label = 'Fecha adquisici&oacute;n';
            $obj->name = 'fechaadq';
            $obj->allowBlank = true;
            $obj->sortable = true;
            $obj->tipo = 'date';
            $obj->default = true;
            $obj->descripcion = 'Fecha de adquisición del medio';
            $obj->obligatorio = (!$objConfPG[0]['explotacionadquisicion'] &&
                $objConfPG[0]['depreciacion']) ? true : false;
            if (!in_array($obj, $result)) {
                array_push($result, $obj);
            }
        }

        if ($atributo == 'valorcontable' || $objConfPG[0]['depreciacion']) {
            $obj = new stdClass();
            $obj->label = 'Valor contable';
            $obj->sortable = true;
            $obj->name = 'valorcontable';
            $obj->descripcion = 'Valor contable';
            $obj->tipo = 'numberfield';
            $obj->default = true;
            if (!in_array($obj, $result)) {
                array_push($result, $obj);
            }
        }
        if ($atributo == 'vidautil' || $objConfPG[0]['depreciacion']) {
            $obj = new stdClass();
            $obj->label = 'Vida util';
            $obj->sortable = true;
            $obj->name = 'vidautil';
            $obj->descripcion = 'Vida util';
            $obj->tipo = 'numberfield';
            $obj->default = true;
            if (!in_array($obj, $result)) {
                array_push($result, $obj);
            }
        }
        if ($atributo == 'tasafiscal' || $objConfPG[0]['depreciacion']) {
            $obj = new stdClass();
            $obj->label = 'Tasa fiscal';
            $obj->sortable = true;
            $obj->name = 'tasafiscal';
            $obj->descripcion = 'Tasa fiscal';
            $obj->tipo = 'numberfield';
            $obj->default = true;
            if (!in_array($obj, $result)) {
                array_push($result, $obj);
            }
        }
        if ($atributo == 'porcientorecuperacion' || $objConfPG[0]['depreciacion']) {
            $obj = new stdClass();
            $obj->label = '% de recuperaci&oacute;n';
            $obj->sortable = true;
            $obj->name = 'porcientorecuperacion';
            $obj->descripcion = '% de recuperación';
            $obj->tipo = 'numberfield';
            $obj->default = true;
            if (!in_array($obj, $result)) {
                array_push($result, $obj);
            }
        }
        if ($atributo == 'kilometraje' || $objConfPG[0]['depreciacion']) {
            ;
            $obj = new stdClass();
            $obj->label = 'Recursos consumidos';
            $obj->sortable = true;
            $obj->name = 'recursoconsumido';
            $obj->descripcion = 'Recursos consumidos';
            $obj->allowBlank = false;
            $obj->tipo = 'numberfield';
            $obj->default = true;
            if (!in_array($obj, $result)) {
                array_push($result, $obj);
            }

        }
        if ($atributo == 'depreciacionacumulada' || $objConfPG[0]['depreciacion']) {
            $obj = new stdClass();
            $obj->label = 'Depreciaci&oacute;n acumulada';
            $obj->sortable = true;
            $obj->name = 'depreciacionacumulada';
            $obj->descripcion = 'Depreciación acumulada';
            $obj->tipo = 'numberfield';
            $obj->default = true;
            if (!in_array($obj, $result)) {
                array_push($result, $obj);
            }
        }
        return $result;
    }

    public function getLabelNameObjectsFromData($datos, $idEntidad, $useDepreciacion)
    {

        if (!$idEntidad) {
            $classEstructura = 'Estructura';
            $idEntidad = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;
        }
        $objConfPG = array();

        if ($useDepreciacion) {
            $objConfPG = ConfiguracionActivosService::getConfiguracionPG($idEntidad, $this->tipo);
        }
        $result = array();

        foreach ($datos as $atributo => $valor) {
            if ($valor == '1') {

                $result = self::getLabelNameObjectsFromDataIF($result, $atributo, $objConfPG);
                if ($atributo == 'numserie') {
                    $obj = new stdClass();
                    $obj->label = 'No de serie';
                    $obj->sortable = true;
                    $obj->name = 'nroserie';
                    $obj->descripcion = 'No de serie';
                    $obj->allowBlank = true;
                    $obj->default = true;
                    $obj->tipo = 'textfield';
                    array_unshift($result, $obj);
                    // array_push($result, $obj);
                }
                // if ($atributo == 'denominacion') {
                //     $obj = new stdClass();
                //     $obj->label = 'denominacion';
                //     $obj->sortable = true;
                //     $obj->name = 'denominacion';
                //     $obj->descripcion = 'denominacion';
                //     $obj->allowBlank = true;
                //     $obj->default = true;
                //     $obj->tipo = 'textfield';
                //     array_push($result, $obj);
                // }
                /* if ($atributo == 'numchasis') {
                  $obj = new stdClass();
                  $obj->label = 'No de chasis';
                  $obj->name = 'nroserie';
                  $obj->descripcion = 'No de chasis';
                  $obj->allowBlank = false;
                  $obj->tipo = 'textfield';
                  array_unshift($result, $obj);
                  // array_push($result, $obj);
                  } */
                if ($atributo == 'numinventario') {
                    $obj = new stdClass();
                    $obj->label = 'No de inventario';
                    $obj->sortable = true;
                    $obj->name = 'nroinventario';
                    $obj->descripcion = 'No de inventario';
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    $obj->default = true;
                    if ($objConfPG[0]['autogenerado']) {
                        $obj->autogenerado = true;
                    }
                    array_push($result, $obj);
                }
                if ($atributo == 'garantia') {

                    $obj = new stdClass();
                    $obj->label = 'Recurso consumido m&aacute;ximo';
                    $obj->sortable = true;
                    $obj->name = 'recursoconsumidomax';
                    $obj->descripcion = 'Recurso consumido máximo';
                    $obj->allowBlank = false;
                    $obj->tipo = 'numberfield';
                    $obj->default = true;
                    array_push($result, $obj);

                    $obj = new stdClass();
                    $obj->label = 'Fecha inicial de la garant&iacute;a';
                    $obj->sortable = true;
                    $obj->name = 'fechainicialgarantia';
                    $obj->descripcion = 'Fecha inicial de la garantía';
                    $obj->allowBlank = false;
                    $obj->default = true;
                    $obj->tipo = 'date';
                    array_push($result, $obj);

                    $obj = new stdClass();
                    $obj->label = 'Fecha fin de la garant&iacute;a';
                    $obj->sortable = true;
                    $obj->descripcion = 'Fecha fin de la garantía';
                    $obj->name = 'fechafingarantia';
                    $obj->allowBlank = false;
                    $obj->default = true;
                    $obj->tipo = 'date';
                    array_push($result, $obj);

                    /* $obj = new stdClass();
                      $obj->label = 'Garant&iacute;a';
                      $obj->name = 'garantia';
                      array_push($result, $obj); */
                }
                if ($atributo == 'responsable') {
                    $obj = new stdClass();
                    $obj->label = 'Responsable';
                    $obj->sortable = true;
                    $obj->name = 'idresponsable';
                    $obj->descripcion = 'Responsable';
                    $obj->allowBlank = true;
                    $obj->default = true;
                    $obj->tipo = 'win_responsable';
                    array_push($result, $obj);
                }
                if ($atributo == 'annofabricacion') {
                    $obj = new stdClass();
                    $obj->label = 'Año de fabricaci&oacute;n';
                    $obj->sortable = true;
                    $obj->descripcion = 'Año de fabricación';
                    $obj->name = 'annofabricacion';
                    $obj->allowBlank = true;
                    $obj->default = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($atributo == 'colorprim') {
                    $obj = new stdClass();
                    $obj->label = 'Color primario';
                    $obj->sortable = true;
                    $obj->descripcion = 'Color primario';
                    $obj->name = 'idcolorprim';
                    $obj->allowBlank = true;
                    $obj->default = true;
                    $obj->tipo = 'combo';
                    array_push($result, $obj);
                }
                if ($atributo == 'colorsec') {
                    $obj = new stdClass();
                    $obj->label = 'Color secundario';
                    $obj->sortable = true;
                    $obj->descripcion = 'Color secundario';
                    $obj->name = 'idcolorsec';
                    $obj->allowBlank = true;
                    $obj->tipo = 'combo';
                    $obj->default = true;
                    array_push($result, $obj);
                }
                if ($atributo == 'ubicacion') {
                    $obj = new stdClass();
                    $obj->label = 'Ubicaci&oacute;n';
                    $obj->sortable = true;
                    $obj->descripcion = 'Ubicación';
                    $obj->name = 'idubicacion';
                    $obj->allowBlank = true;
                    $obj->tipo = 'win_ubicacion';
                    $obj->default = true;
                    array_push($result, $obj);
                }
                if ($atributo == 'categoria') {
                    $obj = new stdClass();
                    $obj->label = 'Categor&iacute;a';
                    $obj->sortable = true;
                    $obj->descripcion = 'Categoría';
                    $obj->name = 'idcategoria';
                    $obj->allowBlank = true;
                    $obj->tipo = 'combo';
                    $obj->default = true;
                    array_push($result, $obj);
                }

                /*  if ($atributo == 'fechaadq') {
                  $obj = new stdClass();
                  $obj->label = 'Fecha adquisici&oacute;n';
                  $obj->descripcion = 'Fecha adquisición';
                  $obj->name = 'fechaadq';
                  $obj->allowBlank = true;
                  $obj->tipo = 'date';
                  array_push($result, $obj);
                  } */
            }
            if ($atributo == 'estado') {
                $obj = new stdClass();
                $obj->label = 'Estado t&eacute;cnico';
                $obj->sortable = true;
                $obj->name = 'idestatustecnico';
                $obj->descripcion = 'Estado técnico';
                $obj->allowBlank = false;
                $obj->default = true;
                $obj->tipo = 'combo';
                array_push($result, $obj);
            }
            /* if ($atributo == 'valoradquisicion') {
              $obj = new stdClass();
              $obj->label = 'Valor de adquisici&oacute;n';
              $obj->name = 'valoradquisicion';
              $obj->descripcion = 'Valor de adquisición';
              $obj->allowBlank = true;
              $obj->tipo = 'numberfield';
              array_push($result, $obj);
              } */
              $obj = new stdClass();
              $obj->label = 'Denominacion';
              $obj->sortable = true;
              $obj->name = 'denominacion';
              $obj->descripcion = 'Denominacion';
              $obj->tipo = 'textfield';
              $obj->default = true;
              if (!in_array($obj, $result)) {
                  array_push($result, $obj);
              }
              $obj = new stdClass();
              $obj->label = 'Grupo';
              $obj->sortable = true;
              $obj->name = 'idgruposubgrupo';
              $obj->descripcion = 'Grupo';
              $obj->tipo = 'combo';
              $obj->default = true;
              if (!in_array($obj, $result)) {
                  array_push($result, $obj);
              }
           
            $obj = new stdClass();
            $obj->label = 'Naturaleza';
            $obj->sortable = true;
            $obj->name = 'idnaturaleza';
            $obj->descripcion = 'Naturaleza';
            $obj->tipo = 'combo';
            $obj->default = true;
            if (!in_array($obj, $result)) {
                array_push($result, $obj);
            }
            $obj = new stdClass();
            $obj->label = 'Valor de adquisici&oacute;n';
            $obj->sortable = true;
            $obj->name = 'valoradquisicion';
            $obj->descripcion = 'Valor de adquisición';
            $obj->allowBlank = true;
            $obj->default = true;
            $obj->tipo = 'numberfield';
            if (!in_array($obj, $result)) {
                array_push($result, $obj);
            }
        }
        $obj = new ConfparametrosgeneralesModel();
        $activTransporte = $obj->getConfiguracionPG(null, 0);

        if ($activTransporte[0]['transporte'] != 0 || $activTransporte[0]['buque'] != 0){
            foreach ($this->listaPlugins as $plugin) {
                $plugin->getLabelNameObjectsFromData($datos, $result);
            }
        }

        return $result;
    }

    /* Metodo que carga las columnas de patrimonio
     */
}
