<?php

/**
 *  Jorge Luis Cuellar Mondeja 28/10/2011
 */
class RegNumericoActivoModel extends RegNumericoModel
{
    protected $metadataModel;
    protected $tablaModel;
    protected $_mComunAFT;
    protected $mMovRegNumericoActivo;
    protected $mMovRegNum;
    protected $mAtrDinamRegNum;
    protected $mModuloRegNum;
    protected $idsubsistema;
    protected $sConfActivos; //$metadataModel, $tablaModel, $_mComunAFT, $mMovRegNumericoActivo, $mMovRegNum,

    //$mAtrDinamRegNum,$mModuloRegNum, $sConfActivos;

    /**
     *
     */
    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {
        $this->idsubsistema = $idsubsistema;

        parent::__construct();
        $this->setBaseAlias('drna');
        $this->metadataModel = ZendExt_Metadata:: getInstance()->Metadata();
        $this->tablaModel = new ZendExt_Metadata_Models_TablaModel();
        $this->_mComunAFT = ComunAFTModel::getInstance($this->idsubsistema);
        $this->mMovRegNumericoActivo = new MovRegnumericoActivoModel();
        $this->mMovRegNum = new MovRegNumericoModel();
        $this->mAtrDinamRegNum = new RegNumericoAtribDinamicoModel();

        if (class_exists('RegNumericoModuloModel')) {
            $this->mModuloRegNum = new RegNumericoModuloModel();
        } else {
            $this->mModuloRegNum = false;
        }

        $this->sConfActivos = new ConfiguracionActivosService();
    }

    /**
     *
     */
    public function initBaseModel()
    {
        $this->baseModel = new DatRegnumericoActivo();
    }

    /**
     *
     */
    private function getSelect(Doctrine_Query $query, $alias = 'rn', $isTree = false)
    {
        $query->addSelect($this->getSelectRegNumOperativo($alias, $isTree));
        $query->addSelect($this->getQuerySelectFields($alias));
    }

    /**
     *
     */
    protected function getWhere(&$query, $alias, $filtro)
    {
        $this->addQueryFilters($query, $alias, $filtro);
    }

    /**
     *
     */
    public function addJoinModel(Doctrine_Query $query, $aliasExterno, $aliasLocal = 'rna', $includeSelect = true,
        $parametros = array(), $join = 1)
    {
        if ($join) {
            $query->innerJoin("$aliasExterno.DatRegnumericoActivo $aliasLocal");
        } else {
            $query->leftJoin("$aliasExterno.DatRegnumericoActivo $aliasLocal");
        }
        if ($parametros) {
            $this->getWhere($query, $aliasLocal, $parametros);
        }
        if ($includeSelect) {
            $this->getSelect($query, $aliasLocal);
        }

        return $query;
    }

    /**
     *
     */
    public function addQueryFilters(Doctrine_Query $query, $aliasTabla, $parametros = array(), $movTable = false)
    {
        if ($parametros['estadoperacion'] && count($parametros['estadoperacion']) > 0) {

            $query->whereIn("$aliasTabla.idestadoperacion", $parametros['estadoperacion']);
        }
        if ($parametros['idestatustecnico']) {
            $query->addWhere("$aliasTabla.idestatustecnico = {$parametros['idestatustecnico']}");
        }
        if ($parametros['denomestadotecnico']) {
            $query->addWhere("net.denominacion iLike '%{$parametros['denomestadotecnico']}%'");
        }

        if ($parametros['estados']) {
            $query->whereIn("$aliasTabla.idestatustecnico", $parametros['estados']);
        }
        if ($parametros['min_annofabricacion']) {
            $query->addWhere("$aliasTabla.annofabricacion > ?", array($parametros['min_annofabricacion']));
        }
        if ($parametros['max_annofabricacion']) {
            $query->addWhere("$aliasTabla.annofabricacion < ?", array($parametros['max_annofabricacion']));
        }
        if ($parametros['annofabricacion']) {
            $query->addWhere("$aliasTabla.annofabricacion = ?", array($parametros['annofabricacion']));
        }

        if ($parametros['recursoconsumido']) {
            $query->addWhere("$aliasTabla.recursoconsumido = ?", array($parametros['recursoconsumido']));
        }
        if ($parametros['min_recursoconsumido']) {
            $query->addWhere("$aliasTabla.recursoconsumido  > ?", array($parametros['min_recursoconsumido']));
        }
        if ($parametros['max_recursoconsumido']) {
            $query->addWhere("$aliasTabla.recursoconsumido < ?", array($parametros['max_recursoconsumido']));
        }

        if (is_numeric($parametros['cantidadrecursoconsumido'])) {
            $query->addWhere(
                "$aliasTabla.cantidadrecursoconsumido = ?", array($parametros['cantidadrecursoconsumido'])
            );
        }

        if (is_numeric($parametros['valoradquisicion'])) {
            $query->addWhere("$aliasTabla.valoradquisicion = ?", array($parametros['valoradquisicion']));
        }

        if ($parametros['fechaexpini']) {
            $query->addWhere("$aliasTabla.fechaexpini = ?", array($parametros['fechaexpini']));
        }

        if ($parametros['fechaexpfin']) {
            $query->addWhere("$aliasTabla.fechaexpfin = ?", array($parametros['fechaexpfin']));
        }

        if ($parametros['fechaadq']) {
            $query->addWhere("$aliasTabla.fechaadq = ?", array($parametros['fechaadq']));
        }

        if ($parametros['fechainicialgarantia']) {
            $query->addWhere("$aliasTabla.fechainicialgarantia = ?", array($parametros['fechainicialgarantia']));
        }

        if ($parametros['fechafingarantia']) {
            $query->addWhere("$aliasTabla.fechafingarantia = ?", array($parametros['fechafingarantia']));
        }

        if ($parametros['nroinventario']) {
            $query->addWhere("{$aliasTabla}.nroinventario iLike '%{$parametros['nroinventario']}%'");
        }

        if (is_numeric($parametros['depreciacionacumulada'])) {
            $query->addWhere("$aliasTabla.depreciacionacumulada = ?", array($parametros['depreciacionacumulada']));
        }

        if (is_numeric($parametros['vidautil'])) {
            $query->addWhere("$aliasTabla.vidautil = ?", array($parametros['vidautil']));
        }

        if (is_numeric($parametros['tasafiscal'])) {
            $query->addWhere("$aliasTabla.tasafiscal = ?", array($parametros['tasafiscal']));
        }

        if (is_numeric($parametros['porcientorecuperacion'])) {
            $query->addWhere("$aliasTabla.porcientorecuperacion = ?", array($parametros['porcientorecuperacion']));
        }

        if (is_numeric($parametros['valorcontable'])) {
            $query->addWhere("$aliasTabla.valorcontable = ?", array($parametros['valorcontable']));
        }

        if ($parametros['recursoconsumidomax']) {
            $query->addWhere("$aliasTabla.recursoconsumidomax = ?", array($parametros['recursoconsumidomax']));
        }
        if ($parametros['min_recursoconsumidomax']) {
            $query->addWhere("$aliasTabla.recursoconsumidomax  > ?", array($parametros['min_recursoconsumidomax']));
        }
        if ($parametros['max_recursoconsumidomax']) {
            $query->addWhere("$aliasTabla.recursoconsumidomax < ?", array($parametros['max_recursoconsumidomax']));
        }

        if ($parametros['garantia']) {
            $query->addWhere("$aliasTabla.garantia = ?", array($parametros['garantia']));
        }
      
        if ($parametros['idgruposubgrupo'] && count($parametros['idgruposubgrupo']) > 0) {
           // print_r($parametros['idgruposubgrupo']);die;
            $query->whereIn("$aliasTabla.idgruposubgrupo", $parametros['idgruposubgrupo']);
            //print_r($query->getSqlQuery());die;
        }

        // if ($parametros['idgruposubgrupo'] && count($parametros['idgruposubgrupo']) > 0) {
        //    // print_r($parametros['idgruposubgrupo']);die;
        //     $query->whereIn("$aliasTabla.idgruposubgrupo",array( $parametros['idgruposubgrupo']));
        //     print_r($query->getSqlQuery());die;
        // }
        if ($parametros['idactividad']) {
            $query->addWhere("$aliasTabla.idactividad = ?", array($parametros['idactividad']));
        }
        if ($parametros['actividad']) {
            $query->addWhere("nact.denominacion  ILIKE '%{$parametros['actividad']}%'");
        }

        if ($parametros['idcategoria']) {
            $query->addWhere("$aliasTabla.idcategoria = ?", array($parametros['idcategoria']));
        }
        if ($parametros['idcentrocosto']) {
            $query->addWhere("$aliasTabla.idcentrocosto = ?", array($parametros['idcentrocosto']));
        }
        if ($parametros['categoria']) {
            $query->addWhere("cat.denominacion = ?", array($parametros['categoria']));
        }

        if ($parametros['idcolorprim']) {
            $query->addWhere("$aliasTabla.idcolorprim = ?", array($parametros['idcolorprim']));
        }
        if ($parametros['colorprim']) {
            $query->addWhere("ntc_prim.denominacion ILIKE '%{$parametros['colorprim']}%'");
        }

        if ($parametros['idcolorsec']) {
            $query->addWhere("$aliasTabla.idcolorsec = ?", array($parametros['idcolorsec']));
        }
        if ($parametros['colorsec']) {
            $query->addWhere("ntc_sec.denominacion ILIKE '%{$parametros['colorsec']}%'");
        }

        if(is_numeric($parametros['responsable']) && is_null($parametros['idresponsable'])){
            $parametros['idresponsable'] = $parametros['responsable'];
            unset($parametros['responsable']);
        }
        
        if (is_numeric($parametros['idresponsable'])) {
            $query->addWhere("$aliasTabla.idresponsable = ?", array($parametros['idresponsable']));
        }
        
        if($parametros['responsable'])
        {
            $arrNombresConEspacios = explode(" ", $parametros['responsable']);
            
            $arrNombres = array();
            foreach ($arrNombresConEspacios as $value) 
                if($value != " " && $value != "")
                    $arrNombres[] = $value;
            if(count($arrNombres)>0){
                $filter ="";
                foreach($arrNombres as $i => $value) {
                    if($i>0) $filter .= " OR ";
                    $filter .= " personaplug.nombre ilike '%{$value}%' OR "
                        . " personaplug.papel ilike '%{$value}%' OR "
                        . " personaplug.sapel ilike '%{$value}%' ";
                }
                $query->addWhere($filter);
            }            
        }

        if ($parametros['denomarearesp']) {
            $query->addWhere("deop.denominacion ILIKE '%{$parametros['denomarearesp']}%'");
        }
        if ($parametros['colorsec']) {
            $query->addWhere("ntc_sec.denominacion ILIKE '%{$parametros['colorsec']}%'");
        }

        if ($parametros['idregnumerico']) {
            if (is_array($parametros['idregnumerico'])) {
                $query->andWhereIn("$aliasTabla.idregnumerico", $parametros['idregnumerico']);
            } else {
                $query->addWhere("$aliasTabla.idregnumerico = ?", array($parametros['idregnumerico']));
            }
        }

        if ($parametros['idarearesp']) {
            if (is_array($parametros['idarearesp'])) {
                $query->andWhereIn("$aliasTabla.idarearesp", $parametros['idarearesp']);
            } else {
                $query->addWhere("$aliasTabla.idarearesp = ?", array($parametros['idarearesp']));
            }
        }

        if ($parametros['tree']) {

            if (!$parametros['anode'] && !$parametros['_id']) {
                $query->addWhere("$aliasTabla.idregnumerico = $aliasTabla.idregnumerico");
            }

            if ($parametros['_id']) {
                $query->addWhere("$aliasTabla.idpadre = ?", array($parametros['_id']));
                $query->addWhere("$aliasTabla.idregnumerico <> ?", array($parametros['_id']));
            }

            if ($parametros['anode'] && $parametros['busAvz'] != 2) {
                $query->addWhere("$aliasTabla.idpadre = ?", array($parametros['anode']));
                $query->addWhere("$aliasTabla.idregnumerico <> ?", array($parametros['anode']));
            }
        }

        if ($parametros['modulo']) {
            $query->addWhere("$aliasTabla.esmodulo = ?", array($parametros['modulo']));
        }

        if ($parametros['idpadre']) {
            $query->addWhere("$aliasTabla.idpadre = ?", array($parametros['idpadre']));
            $query->addWhere("$aliasTabla.idregnumerico <> ?", array($parametros['idpadre']));
        }
        // Columnas que no posee la tabla de registro numérico y no la de su movimiento
        if (!$movTable) {
            $query->addWhere(
                "$aliasTabla.plantilla = ?", array(($parametros['plantilla']) ? $parametros['plantilla'] : 1)
            );
        }
        $query = $this->GetFiltrosRegnumericosEntidad($parametros, $query);
        if ($parametros['ubicacion']) {
            $query->addWhere("eu.descripcion ILIKE '%{$parametros['ubicacion']}%'");
        }
       // print_r($parametros);die;

        return $query;
    }

    public function GetFiltrosRegnumericosEntidad($parametros, $query)
    {

        if ($parametros['idestadoperacion']) {
            $query->addWhere('drna.idestadoperacion = ?', $parametros['idestadoperacion'] - 1);
        }
        if ($parametros['estadooperacion']) {
            $arrEstadosOperaciones = $this->_mComunAFT->GetArrEstadosoperacion();
            foreach ($arrEstadosOperaciones as $id => $row) {
                $pos = stripos($row, $parametros['estadooperacion']);
                if ($pos !== false) {
                    $query->addWhere('drna.idestadoperacion = ?', $id);
                }
            }
        }

        if ($parametros['min_vidautil']) {
            $query->addWhere('drna.vidautil >=?', $parametros['min_vidautil']);
        }
        if ($parametros['min_valorcontable']) {
            $query->addWhere('drna.valorcontable >=?', $parametros['min_valorcontable']);
        }
        if ($parametros['min_valorcontable']) {
            $query->addWhere('drna.valorcontablealternativo >=?', $parametros['min_valorcontable']);
        }
        if ($parametros['min_valorcontablealternativo']) {
            $query->addWhere('drna.valoradquisicion >=?', $parametros['min_valorcontablealternativo']);
        }
        if ($parametros['min_porcientorecuperacion']) {
            $query->addWhere('drna.porcientorecuperacion >=?', $parametros['min_porcientorecuperacion']);
        }
        if ($parametros['min_depreciacionacumulada']) {
            $query->addWhere('drna.depreciacionacumulada >=?', $parametros['min_depreciacionacumulada']);
        }
        if ($parametros['min_depreciacionacumuladaalternativo']) {
            $query->addWhere(
                'drna.depreciacionacumuladaalternativo >=?', $parametros['min_depreciacionacumuladaalternativo']
            );
        }
        if ($parametros['min_cantidadrecursoconsumido']) {
            $query->addWhere('drna.cantidadrecursoconsumido >=?', $parametros['min_cantidadrecursoconsumido']);
        }
        if ($parametros['min_fechaadq']) {
            $query->addWhere('drna.fechaadq >= ?', $parametros['min_fechaadq']);
        }
        if ($parametros['min_fechaexpini']) {
            $query->addWhere('drna.fechaexpini >= ?', $parametros['min_fechaexpini']);
        }
        if ($parametros['min_fechaexpfin']) {
            $query->addWhere('drna.fechaexpini >= ?', $parametros['min_fechaexpfin']);
        }
        if ($parametros['min_fechainicialgarantia']) {
            $query->addWhere('drna.fechainicialgarantia >= ?', $parametros['min_fechainicialgarantia']);
        }
        if ($parametros['min_fechafingarantia']) {
            $query->addWhere('drna.fechafingarantia >= ?', $parametros['min_fechafingarantia']);
        }



        $query = self::getFiltrosRegnumericosEntidadIf($parametros, $query);
        return $query;
    }

    public function getFiltrosRegnumericosEntidadIf($parametros, $query)
    {
        if ($parametros['max_vidautil']) {
            $query->addWhere('drna.vidautil <=?', $parametros['max_vidautil']);
        }
        if ($parametros['max_valorcontable']) {
            $query->addWhere('drna.valorcontable <=?', $parametros['max_valorcontable']);
        }
        if ($parametros['max_valorcontablealternativo']) {
            $query->addWhere('drna.valorcontablealternativo <=?', $parametros['max_valorcontablealternativo']);
        }
        if ($parametros['max_valoradquisicion']) {
            $query->addWhere('drna.valoradquisicion <=?', $parametros['max_valoradquisicion']);
        }
        if ($parametros['max_porcientorecuperacion']) {
            $query->addWhere('drna.porcientorecuperacion <=?', $parametros['max_porcientorecuperacion']);
        }
        if ($parametros['max_depreciacionacumulada']) {
            $query->addWhere('drna.depreciacionacumulada <=?', $parametros['max_depreciacionacumulada']);
        }
        if ($parametros['max_depreciacionacumuladaalternativo']) {
            $query->addWhere(
                'drna.depreciacionacumuladaalternativo <=?', $parametros['max_depreciacionacumuladaalternativo']
            );
        }
        if ($parametros['max_cantidadrecursoconsumido']) {
            $query->addWhere('drna.cantidadrecursoconsumido <=?', $parametros['max_cantidadrecursoconsumido']);
        }
        if ($parametros['max_fechaadq']) {
            $query->addWhere('drna.fechaadq <= ?', $parametros['max_fechaadq']);
        }
        if ($parametros['min_fechaexpini']) {
            $query->addWhere('drna.fechaexpini < =?', $parametros['min_fechaexpini']);
        }
        if ($parametros['min_fechaexpfin']) {
            $query->addWhere('drna.fechaexpfin <= ?', $parametros['min_fechaexpfin']);
        }
        if ($parametros['min_fechainicialgarantia']) {
            $query->addWhere('drna.fechainicialgarantia <= ?', $parametros['min_fechainicialgarantia']);
        }
        if ($parametros['min_fechafingarantia']) {
            $query->addWhere('drna.fechafingarantia <= ?', $parametros['min_fechafingarantia']);
        }
        if ($parametros['idmarca']) {
            $query->addWhere('nmarc.idmarca =?', $parametros['idmarca']);
        }
        return $query;
    }

    /**
     *
     */
    public function getSelectRegNumOperativo($alias, $isTree = false)
    {
        $datosIsTre = array();
        if ($isTree) {
            $datosIsTre = array(
                '_id' => '_p.idregnumerico',
                '_parent' => "(case WHEN _p.idpadre = _p.idregnumerico then null else _p.idpadre end)",
                '_is_leaf' => '(CASE WHEN (_p.ordender - _p.ordenizq ) = 1 THEN true ELSE false END)',
                '_lft' => '_p.ordenizq',
                '_level' => '1',
                '_rgt' => '_p.ordender'
            );
        }

        $arrayQueryStrings = array(
            'idpadremodulo' => '_p.idpadre',
            'idarbol' => '_p.idarbol',
            'ordendermodulo' => '_p.ordender',
            'ordenizqmodulo' => '_p.ordenizq',
            'idarbolmodulo' => '_p.idarbol',
            'asignado' => '_p.asignado',
            'esmodulo' => '_p.esmodulo',
            'esbaja' => '_p.esbaja',
            'plantilla' => '_p.plantilla',
            'estaentidad' => '_p.estaentidad',
            'valormodulo' => '_p.valormodulo',
            'valormoduloalternativo' => '_p.valormoduloalternativo',
            'recursoconsumidomax' => '_p.recursoconsumidomax',
            'fechafingarantia' => '_p.fechafingarantia',
            'fechainicialgarantia' => '_p.fechainicialgarantia',
            'fechafingarantia' => '_p.fechafingarantia',
            'idestadoperacion' => '_p.idestadoperacion',
            'recursoconsumido' => '_p.recursoconsumido',
            'datos' => '_p.datos'
        );

        $arrresult = array_merge($arrayQueryStrings, $datosIsTre);
        return $this->doctrineHelper->getStrSelectString($arrresult, $alias, '_p');
    }

    /**
     *
     */
    public function getQuerySelectFields($alias)
    {
        $arrayQueryStrings = array(
            'denominacion' => '_p.denominacion',
            'idgruposubgrupo' => '_p.idgruposubgrupo',
            'idnaturaleza' => '_p.idnaturaleza',
            'nroinventario' => '_p.nroinventario',
            'depreciacionacumulada' => '_p.depreciacionacumulada',
            'depreciacionacumuladaalternativo' => '_p.depreciacionacumuladaalternativo',
            'vidautil' => '_p.vidautil',
            'porcientorecuperacion' => '_p.porcientorecuperacion',
            'valorcontable' => '_p.valorcontable',
            'valorcontablealternativo' => '_p.valorcontablealternativo',
            'valoradquisicionalternativo' => '_p.valoradquisicionalternativo',
            'fechaexpini' => '_p.fechaexpini',
            'fechaexpfin' => '_p.fechaexpfin',
            'fechaadq' => '_p.fechaadq',
            'tasafiscal' => '_p.tasafiscal',
            //'tasafiscalalternativo' => '_p.tasafiscalalternativo',
            // 'garantia' => '_p.garantia',
            'idarearesp' => '_p.idarearesp',
            'idcolorprim' => '_p.idcolorprim',
            'idcolorsec' => '_p.idcolorsec',
            'valoradquisicion' => '_p.valoradquisicion',
            'idcentrocosto' => '_p.idcentrocosto',
            'idestatustecnico' => '_p.idestatustecnico',
            'idubicacion' => '_p.idubicacion',
            'idactividad' => '_p.idactividad',
            'annofabricacion' => '_p.annofabricacion',
            'idcategoria' => '_p.idcategoria',
            'idresponsable' => '_p.idresponsable',
            'cantidadrecursoconsumido' => '_p.cantidadrecursoconsumido',
            'fechainicialgarantia' => '_p.fechainicialgarantia',
            'fechafingarantia' => '_p.fechafingarantia',
            'recursoconsumidomax' => '_p.recursoconsumidomax',
            'datos' => '_p.datos'
        );

        return $this->doctrineHelper->getStrSelectString($arrayQueryStrings, $alias, '_p');
    }

    /**
     *
     */
    public function ordenarArbolModulosRegNumericos($idarbol = 0)
    {
        $conn = Zend_Registry::get('conexion');
        $conn->fetchAll("SELECT * FROM \"mod_logactivofijotangible\".\"f_reordenararbolrn\"({$idarbol})");
    }

    /**
     *
     */
    public function beforeDelete($parametros)
    {
        $cDatRegnumericoActivo = 'DatRegnumericoActivo';

        // PARA ELIMINAR EN LOS MAPAS LOS ACTIVOS
        $GISService = ServiciosGISHelper::__init();
        $integradoGIT = $GISService->integrado();
        if ($integradoGIT) {
            // consumo el servicio de los GIT para eliminar
            $arrIdregnumericos = [];
        }


        foreach ($parametros as $value) {
            if ($integradoGIT)
                $arrIdregnumericos[] = $value->idregnumerico;

            $ordenIzq = $value->ordenizq;
            $ordenDer = $value->ordender;
            $idArbol = $value->idarbol;
            $regNumerico = Doctrine::getTable('DatRegnumerico')->find($value->idregnumerico);

            if ($this->mModuloRegNum) {
                $hijos = $this->mModuloRegNum->getHijosModulo($value->ordenizq, $value->ordender, $value->idarbol);
                $this->mAtrDinamRegNum->eliminarAtribDinHijosRegNumerico($hijos);
            }

            if ($regNumerico) {

                $idPadreModulo = $regNumerico->$cDatRegnumericoActivo->idpadre;
                $idProducto = $regNumerico->idproducto;

                if ($this->mModuloRegNum) {
                    $this->mModuloRegNum->deleteHijosModulo($ordenIzq, $ordenDer, $idArbol);
                }

                // Busco si el padre del elemento eliminado tiene otros hijos, en caso de que no lo hago una hoja.
                if ($idPadreModulo != $regNumerico->idregnumerico) {
                    $moduloPadre = Doctrine::getTable('DatRegnumericoActivo')->find($idPadreModulo);
                    $hijosPadre = Doctrine::getTable('DatRegnumericoActivo')
                        ->findByDql("idpadre = $idPadreModulo and idregnumerico <> $idPadreModulo");

                    $moduloPadre->esmodulo = (!$hijosPadre || count($hijosPadre) == 0) ? 1 : 2;
                    $moduloPadre->asignado = ($moduloPadre->idregnumerico == $moduloPadre->idpadre || (!$hijosPadre ||
                        count($hijosPadre) == 0)) ? 1 : 2;
                    $moduloPadre->save();
                }

                // Se busca algún registro numérico que tenga ese producto, sino se borra el producto
                $this->actualizarProdRegNumerico($idProducto);
            }
            if ($value->idarbol) {
                $this->ordenarArbolModulosRegNumericos($value->idarbol);
            }
        }

        if($integradoGIT){
            //$GISService->eliminarUnidades($arrIdregnumericos );
        }

    }

    /**
     *
     */
    public function guardarRegNumActivo($parametros)
    {

        $arrIdesRegNumericos = array();
        $cDatRegnumericoActivo = 'DatRegnumericoActivo';
        $cDatPlantilla = 'DatPlantilla';
		new DatRegnumericoTransp();


        foreach ($parametros->activos as $index => $valueAux) {
            $regNumerico = new DatRegnumerico();

            $value = (array) $valueAux;
            (!$value['dinamicos'])?:$value['datos']=json_encode($value['dinamicos']);

            if (!$value['idarearesp']) {
                $value['idarearesp'] = $parametros->idarearesp;
            }

            if (!$value['idregnumerico'] || $value['idregnumerico'] == null || $value['idregnumerico'] == '') {
                unset($value['idregnumerico']);
            }
            $idResponsable = $this->sConfActivos
                ->getResponsableByAreaAndPerson($value['idarearesp'], $value['idpersona']);

            if ($idResponsable != null) {
                $value['idresponsable'] = $idResponsable;
            }

            $this->beforeSave($regNumerico->$cDatRegnumericoActivo, $value);
            if (!is_null($value[$this->primaryKeyField])) {
                $regNumerico->assignIdentifier($value[$this->primaryKeyField]);

                if ($parametros->modificar) {
                    $regNumerico->$cDatRegnumericoActivo->$cDatPlantilla->color = 1;
                }
            }

            if (count($value['imagenesInsertar']) != 0) {
                $arregloidsImagenes = $this->insertarImagenes($value['imagenesInsertar']);
            }
            if (count($value['imagenesEliminar'] != 0)) {
                $this->eliminarImagenes($value['imagenesEliminar'], $value['idregnumerico']);
            }

            //  Buscamos si existe un idproducto en la estructura con ese idprod.
            $prod = Doctrine_Query::create()
                ->select('p.idproducto as idproducto')
                ->from('DatProductoLogistica p')
                ->where('p.idestructura = ? and p.idindicador = ?')
                ->fetchOne(array($parametros->idarearesp, $value['idindicador']));

            if (!$prod && !$prod->idproducto) {

                // En caso de que no exista el idprod en la entidad
                $prod = new DatProductoLogistica();
                $prod->idindicador = $value['idindicador'];
                $prod->idestructura = $parametros->idarearesp;
                $prod->save();
            }

            $regNumerico->idproducto = $prod->idproducto;
            (!$value['nroserie'])?:$regNumerico->nroserie = $value['nroserie'];
            if ($parametros->plantilla == 2) {
                $regNumerico->$cDatRegnumericoActivo->$cDatPlantilla->synchronizeWithArray($value);
            }
            if ($parametros->idpadreModulo) {

                $padreModulo = Doctrine::getTable('DatRegnumericoActivo')->find($parametros->idpadreModulo);
                $padreModulo->esmodulo = 2;
                $padreModulo->asignado = 2;
                $padreModulo->save();

                $regNumerico->$cDatRegnumericoActivo->idpadre = $parametros->idpadreModulo;
                $regNumerico->$cDatRegnumericoActivo->asignado = 2;
            }
            if ($value['esmodulo'] != 1 && !$value['cantidadStoreModulo']) {
                $regNumerico->$cDatRegnumericoActivo->esmodulo = 1;
            }

            $regNumerico->save();

            if ($value['esmodulo'] != 1 && $this->mModuloRegNum) {
                if (count($value['eliminarHijos']) > 0) {
                    $this->mModuloRegNum->actualizarHijosModulo($value['eliminarHijos']);
                }

                if (count($value['elementoshijos'])) {
                    if ($parametros->plantilla && $parametros->plantilla == 2) {
                        $this->mModuloRegNum->asignarHijosModulo($regNumerico, $value['elementoshijos'], true);
                    } else {
                        $this->mModuloRegNum->asignarHijosModulo($regNumerico, $value['elementoshijos'], false);
                    }
                }
            }
            if ($arregloidsImagenes && count($arregloidsImagenes)) {
                $this->asociarImgRegNumerico($regNumerico, $arregloidsImagenes);
            }
            if($valueAux->elementosXtabla)
                $this->mAtrDinamRegNum->adicionarAtribDinamicosRegNumerico($valueAux->elementosXtabla, $regNumerico);

            if ($parametros->idarbol) {
                $this->ordenarArbolModulosRegNumericos($parametros->idarbol);
            }
            $arrIdesRegNumericos[] = $regNumerico->idregnumerico;

            // PARA INSERTAR EN LOS MAPAS LOS ACTIVOS
            $GISService = ServiciosGISHelper::__init();

			
            if($GISService->integrado()) {
                // Si se esta haciendo una modificacion
                if (!is_null($value[$this->primaryKeyField])){

                    $dataUpdate[$index]['categoria'] = 3;
                    $dataUpdate[$index]['idgps'] = $regNumerico->DatRegnumericoActivo->DatRegnumericoTransp->idgps;
                    $dataUpdate[$index]['matricula'] = $regNumerico->DatRegnumericoActivo->DatRegnumericoTransp->nromatricula;
                    $dataUpdate[$index]['indicativo'] = $regNumerico->DatRegnumericoActivo->DatRegnumericoTransp->indicativo;
                     $dataUpdate[$index]['indiceconsumo'] = $regNumerico->DatRegnumericoActivo->DatRegnumericoTransp->normacombustible;
                    $dataUpdate[$index]['metadata'] = null;

                    $result = $GISService->actualizarUnidad($dataUpdate );
                }else{
                    $array[] = array('cardinalidad' => 'one',
                        'relation' => 'NomIndicadorhoja',
                        'properties' => array('local' => 'idindicador',
                            'foreign' => 'idindicador'));
                    $obj = new NomIndicador();
                    LogisticaDoctrineHelper::__init()->tryInyectRelactions($obj, $array);
                    //$arrparametros['idregistronumerico'] = $regNumerico->idregnumerico;

                    $idestructura = $parametros->idarearesp;
                    $idindicador = $regNumerico->DatProductoLogistica->NomIndicador->idindicador;
                    $sql = "SELECT dm.idmedio
                    FROM mod_estructuracomp.dat_medio dm
                    INNER JOIN mod_estructuracomp.nom_filaestruc nf on nf.idfila = dm.idmedio
                    inner join mod_datosmaestros.nom_indicador i on i.idindicador = dm.idnommedio
                    WHERE 
                        dm.idnommedio IN (
                              SELECT ni.idindicador 
                              FROM mod_datosmaestros.nom_indicador ni 
                              WHERE ni.idarbol = (
                                SELECT ni1.idarbol 
                                FROM mod_datosmaestros.nom_indicador ni1
                                WHERE ni1.idindicador = $idindicador
                              )
                              ORDER BY ni.nivel DESC
                            )
                         and nf.parent_path OPERATOR(public.<@)
						 (SELECT nfe_sub.parent_path FROM mod_estructuracomp.nom_filaestruc nfe_sub WHERE nfe_sub.idfila = $idestructura)
                        --nf.lft > (SELECT nfe1.lft FROM mod_estructuracomp.nom_filaestruc nfe1 WHERE nfe1.idfila = $idestructura) and
                        --nf.rgt < (SELECT nfe2.rgt FROM mod_estructuracomp.nom_filaestruc nfe2 WHERE nfe2.idfila = $idestructura)
                ";

                    $conn = Zend_Registry::get('conexion');				
                    $data = $conn->fetchAll($sql);

                    $arrparametros['idestructuramedio'] = $data[0]['idmedio'];
                    //$arrparametros['idestructura'] = $this->global->Estructura->idestructura;
                    $arrparametros['denominacion'] =
                        $regNumerico->DatProductoLogistica->NomIndicador->denominacion . " - " .
                        $regNumerico->DatProductoLogistica->NomIndicador->NomIndicadorhoja->NomMarca->denominacion . " " .
                        $regNumerico->DatProductoLogistica->NomIndicador->NomIndicadorhoja->NomModelo->denominacion;
                    //categoria (1 - Aéreo, 2 - Marítimo, 3 - Terrestre)
                    $arrparametros['categoria'] = 3;
                    $arrparametros['idgps'] = $regNumerico->DatRegnumericoActivo->DatRegnumericoTransp->idgps;
                    $arrparametros['matricula'] = $regNumerico->DatRegnumericoActivo->DatRegnumericoTransp->nromatricula;

                    $arrparametros['indicativo'] = $regNumerico->DatRegnumericoActivo->DatRegnumericoTransp->indicativo;
                    $arrparametros['indiceconsumo'] = $regNumerico->DatRegnumericoActivo->DatRegnumericoTransp->normacombustible;
                    $arrparametros['metadata'] = null;

                    $result = $GISService->insertarUnidad($arrparametros );
                }
            }
            
        }
        return $arrIdesRegNumericos;
    }

    /**
     *
     */
    public function existeRegNumerico($nroSerie = false, $idRegNumerico = false, $idestructuracomun)
    {
        $query = new Doctrine_Query();
        $query->from('DatRegnumerico rn')->select('idregnumerico');
        $query->innerJoin('rn.DatProductoLogistica p');
        $query->addWhere('p.idestructuracomun = ?', array($idestructuracomun));

        if ($nroSerie) {
            $query->addWhere('nroserie = ?', array($nroSerie));
        }

        if ($idRegNumerico) {
            $query->addWhere('idregnumerico <> ?', array($idRegNumerico));
        }

        return $query->fetchOne()->idregnumerico;
    }

    /**
     *
     */
    public function adicionarRegNumericoActivoNoEntrada($datos, $idOperacion, $idEstructura)
    {
        $idMovimiento = 0;
        $arrIdesRegNumerico = array();

        $operacion = $this->_mComunAFT->getOperacionSobreMediosById($idOperacion);

        foreach ($datos as $dat) {
            array_push($arrIdesRegNumerico, $dat->idregnumerico);
            $idMovimiento = ($dat->idmovimiento) ? $dat->idmovimiento : $idMovimiento;
        }
        $dataCollectMovRegNumerico = $this->mMovRegNumericoActivo
            ->crearMovRegNumericoDesdeRegNumerico($arrIdesRegNumerico, $idMovimiento, $idOperacion, $idEstructura);

            if ($operacion->codigooperacion == 'OPER_MOD_RESPMAS' ) {
                $query = new Doctrine_Query();
                $query->select("da.idresponsabledestino ");
                $query->from('DatDocumentoActivo da'); 
                $dato = $query->where('da.iddocumentoactivo = ?' , array($datos[0]->iddocumento))
                ->fetchArray(); 
                $idresponsable = $dato[0]['idresponsabledestino'];
            }

          

            

        foreach ($dataCollectMovRegNumerico as $movRegNumActivo) {
            // Esto es para conocer que el registro esta siendo usado en un documento que no esta aprobado.
            if ($idresponsable) {
                $movRegNumActivo->DatMovRegnumericoActivo->idresponsable = $idresponsable;
            }
            $movRegNumActivo->DatRegnumerico->enproceso = 1;
            foreach ($this->listaPlugins as $plug) {
                $plug->crearMovRegNumericoDesdeRegNumerico(
                    $movRegNumActivo->DatMovRegnumericoActivo, $idMovimiento, $movRegNumActivo->idregnumerico
                );
            }
        }
        $dataCollectMovRegNumerico->save();
        $cantidad = count($datos);

        /* if ($operacion->signo == '-' || $operacion->signo == '+') {
          $movimiento = Doctrine::getTable('DatMovimientos')->find($idMovimiento);
          //  Decremento la disponibilidad del producto
          $idproducto = $movimiento->idproducto;
          //$cantidad = count($datos);
          $movimiento = new MovimientoService();
          $movimiento->modDisponibilidadMedios($idproducto, $cantidad, $operacion->signo);
          } */

        // Esto mandara a modificar la disponibiliad del producto en dependencia de la configuracion que tenga el
        // fichero configuracion.xml para la operacion que se realiza.

        if ($operacion->signo == '-' && $operacion->afectadisponible == 1) {
            $movimiento = Doctrine::getTable('DatMovimientos')
                ->find($idMovimiento);
            //  Decremento la disponibilidad del producto
            $idproducto = $movimiento->idproducto;
            //$cantidad = count($datos);
            $movimiento = new MovimientoService();
            $movimiento->modDisponibilidadMedios($idproducto, $cantidad, $operacion->signo);
        }

        // Modificar la cantidad del movimiento
        $this->mMovRegNum->incrementarCantidadMovimiento($idMovimiento, $cantidad);
        return $dataCollectMovRegNumerico->toArray();
    }

    /**
     *
     */
    public function guardarRegNumericoActivoInventario($parametros)
{
    $collectionRegNum = new Doctrine_Collection('DatRegnumerico');
    $idMovRegNumerico = null;
    $sConfigActivos = new ConfiguracionActivosService();
    $cfg = $sConfigActivos->getConfiguracionPG($this->global->Estructura->idestructura);
    $cantidad = 0;

 
    $arrAuxActivos = [];
    for ($i = count($parametros->activos) - 1; $i >= 0; $i--) {
        $esta = false;
        foreach ($arrAuxActivos as $activo) {
            if ($activo->idregnumerico == $parametros->activos[$i]->idregnumerico) {
                $esta = true;
                break;
            }
        }
        if (!$esta) {
            array_push($arrAuxActivos, $parametros->activos[$i]);
        } else {
 
            foreach ($arrAuxActivos as $key => $activo) {
                if ($activo->idregnumerico == $parametros->activos[$i]->idregnumerico) {
                    $arrAuxActivos[$key] = $parametros->activos[$i];
                }
            }
        }
    }
    $parametros->activos = array_reverse($arrAuxActivos); 

    foreach ($parametros->activos as $key => $value) {
        $value = (array) $value;
        if (is_numeric($key)) {
            if ($value['idresponsable'] && ($value['idresponsable'] != null)) {
                $query = new Doctrine_Query();
                $idResponsablepersona = $query->select('idpersona')
                    ->from('DatResponsable')
                    ->where('idresponsable = ?', $value['idresponsable'])
                    ->fetchOne()->idpersona;
                    
                if ($responsable && $responsable->idpersona) {
            $idResponsablepersona = $responsable->idpersona;

                $idResponsable = $this->sConfActivos->getResponsableByAreaAndPerson(
                    $value['idarearesp'], $idResponsablepersona
                );
                if ($idResponsable != null) {
                    $value['idresponsable'] = $idResponsable;
                }}
            }
            $regNumerico = $this->mMovRegNum->salvarMovRegNumerico($value, true);

            if (!$regNumerico->idregnumerico) {
                if (!$cantidad) {
                    $idMovRegNumerico = $value['idmovimiento'];
                }
                $cantidad++;
            }

            $collectionRegNum->add($regNumerico);
        }
    }

    // Guardar la colección
    $collectionRegNum->save();

    // Actualizar cantidad en movimiento si es necesario
    if ($cantidad > 0) {
        $tabla = Doctrine::getTable('DatMovimientos')->find($idMovRegNumerico);
        $tabla->cantidad += $cantidad;
        $tabla->save();
    }

    return 2;
}


    /**
     *
     */
    public function cargarMovimientosActivos($parametros, $arrCritDinamicos = null)
    { 
        $maestroProducto = new MaestroProductoModel();

        if ($parametros['limit']) {

            ComunAFTModel::getInstance()
                ->configStartAndLimitInParams($parametros, $parametros['start'], $parametros['limit']);

            $limit = $parametros['limit'];
            $start = $parametros['start'];
        }
        unset($parametros['limit']);

        $query = new Doctrine_Query();

        $query->select(
            "rn.idregnumerico,rn.nroserie as nroserie,mns.idmovregnumerico as idmovregnumerico,
             mns.idmovimiento as idmovimiento"
        )->from("DatRegnumerico rn")->innerJoin("rn.DatMovRegnumerico mns")->orderBy('rn.idregnumerico DESC');

        if ($parametros['nroserie']) {
            $query->addWhere("rn.nroserie LIKE '%".$parametros['nroserie']."%'");
        }
        if ($parametros['idmovimiento']) {
            $query->addWhere("mns.idmovimiento = ?", array($parametros['idmovimiento']));
        }
        $mMovRegNumerico = new MovRegNumericoModel();
        if ($parametros['criterio'] && $parametros['identificador']) {
            $parametros[$parametros['identificador']] = $parametros['criterio'];
            unset($parametros['criterio']);
        }
        $query = $mMovRegNumerico->getDqlMovsRegNumericos($parametros, 'mns');

        $query->innerJoin('rn.DatProductoLogistica p');
        //$maestroProducto->addQueryNomIndicador($query, 'p', 'i', 'ih', true, 'ngsubg');
        //$query->addSelect('i.denominacion as denom');
        //$maestroProducto->addQueryJoinMarcaModelo($query, 'ih', 'nmarc', 'nmod', false, false, 'i');

        $this->mMovRegNumericoActivo->getJoinMovRegNumericoActivo($query, 'mrna', 'mns', 1, false, false);
        $query->addSelect('mrna.denominacion as denominacion');

        $query->addSelect('mrna.importe as importe, mrna.usufructo as usufructo');
        $query->addSelect('mrna.recursoconsumidomax as recursoconsumidomax');
        $query->addSelect('mrna.recursoconsumido as recursoconsumido');
        $query->addSelect('mrna.fechainicialgarantia as fechainicialgarantia');
        $query->addSelect('mrna.fechafingarantia as fechafingarantia');
        

        $query->addSelect('mrna.diferenciavalor as diferenciavalor');
        $query->addSelect('mrna.diferenciavaloralternativo as diferenciavaloralternativo');
		$query->addSelect('mrna.diferenciadepreciacion as diferenciadepreciacion');
        $query->addSelect('mrna.diferenciadepreciacionalternativo as diferenciadepreciacionalternativo');

        if($parametros['codigooperacion'] == 'OPER_MOD_VALOR'){
            $query->addSelect('(mrna.valorcontable + COALESCE(mrna.diferenciavalor,0)) as valorfinal');
            $query->addSelect('(mrna.valorcontablealternativo + COALESCE(mrna.diferenciavaloralternativo,0)) as valorfinalalternativo');

            $query->addSelect('((COALESCE(mrna.valorcontable,0) + COALESCE(mrna.diferenciavalor,0)) - (COALESCE(mrna.depreciacionacumulada,0) + COALESCE(mrna.diferenciadepreciacion,0)))  as valorresidualfinal');
            $query->addSelect('((COALESCE(mrna.valorcontablealternativo,0) + COALESCE(mrna.diferenciavaloralternativo,0)) - (COALESCE(mrna.depreciacionacumuladaalternativo,0) + COALESCE(mrna.diferenciadepreciacionalternativo,0)))  as valorresidualfinalalternativo');

            $query->addSelect('(COALESCE(mrna.depreciacionacumulada,0) + COALESCE(mrna.diferenciadepreciacion,0))  as depreciacionfinal');
            $query->addSelect('(COALESCE(mrna.depreciacionacumuladaalternativo,0) + COALESCE(mrna.diferenciadepreciacionalternativo,0)) as depreciacionfinalalternativo');
        }
        if($parametros['codigooperacion'] == 'OPER_MOD_VALOR_DIS'){
            $query->addSelect('(mrna.valorcontable - COALESCE(mrna.diferenciavalor,0)) as valorfinal');
            $query->addSelect('(mrna.valorcontablealternativo - COALESCE(mrna.diferenciavaloralternativo,0)) as valorfinalalternativo');

            $query->addSelect('((COALESCE(mrna.valorcontable,0) - COALESCE(mrna.diferenciavalor,0)) - (COALESCE(mrna.depreciacionacumulada,0) - COALESCE(mrna.diferenciadepreciacion,0)))  as valorresidualfinal');
            $query->addSelect('((COALESCE(mrna.valorcontablealternativo,0) - COALESCE(mrna.diferenciavaloralternativo,0)) - (COALESCE(mrna.depreciacionacumuladaalternativo,0) - COALESCE(mrna.diferenciadepreciacionalternativo,0)))  as valorresidualfinalalternativo');

            $query->addSelect('(COALESCE(mrna.depreciacionacumulada,0) - COALESCE(mrna.diferenciadepreciacion,0))  as depreciacionfinal');
            $query->addSelect('(COALESCE(mrna.depreciacionacumuladaalternativo,0) - COALESCE(mrna.diferenciadepreciacionalternativo,0)) as depreciacionfinalalternativo');
        }

        if($parametros['codigooperacion'] == 'OPER_MOD_VALOR_UH'){
            $query->addSelect('(mrna.valorcontable + COALESCE(mrna.diferenciavalor,0)) as valorfinal');
            $query->addSelect('(mrna.valorcontablealternativo + COALESCE(mrna.diferenciavaloralternativo,0)) as valorfinalalternativo');
        }
        if($parametros['codigooperacion'] == 'OPER_MOD_VALOR_DIS_UH'){
            $query->addSelect('(mrna.valorcontable - COALESCE(mrna.diferenciavalor,0)) as valorfinal');
            $query->addSelect('(mrna.valorcontablealternativo - COALESCE(mrna.diferenciavaloralternativo,0)) as valorfinalalternativo');
        }


        $query->leftJoin("mrna.DatResponsable r");
        $query->leftJoin("mrna.DatMovRegnumericoInventario mrni");

        $query->addSelect($this->getQuerySelectFields('mrna'));
        $query->addSelect('mrni.color AS color');

        if ($arrCritDinamicos != null) {
            $parametros['idsRegNumMostrar'] = $arrCritDinamicos;
        }
        $this->addQueryFilters($query, 'mrna', $parametros, true);
        $this->leftJoinDatAlternosRegNumerico('mrna', $query);
        $pluginCount = 1;

        $movregnum = new DatMovRegnumericoActivo();
        foreach ($this->listaPlugins as $pluginModel) {
            $pluginModel->initBaseMovRelation($movregnum);
            $pluginModel->addJoinModelMov($query, 'mrna', 'mrnap'.''.$pluginCount, true);
            $pluginModel->addQueryFilters($query, 'mrnap'.''.$pluginCount, $parametros);
            ++$pluginCount;
        }

        if ($limit) {
            $query->limit($limit);
            $query->offset($start);
        }

        $query = $this->innerJoinResponsableRegNumerico($query, 'r', 'personaplug');
        if ($parametros['criterio']) {
            $query->addWhere("i.denominacion iLike '%{$parametros['criterio']}%' ");
        }
        $arrIdesRegNumerico = array();
        if ($parametros['tipo_interfaz'] == 'no_entrada') {

            $querydos = new Doctrine_Query();

            $querydos->select("rn.idregnumerico")
                ->from("DatRegnumerico rn")
                ->innerJoin("rn.DatMovRegnumerico mrn")
                ->orderBy('rn.idregnumerico desc')
                ->where("mrn.idmovimiento = ?", array($parametros['idmovimiento']));

            foreach ($querydos->fetchArray() as $value) {
                array_push($arrIdesRegNumerico, $value['idregnumerico']);
            }
        }


        return array("query" => $query, "idregnumericos" => $arrIdesRegNumerico);
    }

    /**
     *
     */
    public function cargarMovRegNumAftByIds($parametros)
    {
        if ($parametros['limit']) {

            ComunAFTModel::getInstance()
                ->configStartAndLimitInParams($parametros, $parametros['start'], $parametros['limit']);

            $limit = $parametros['limit'];
            $start = $parametros['start'];
        }
        unset($parametros['limit']);
        unset($parametros['start']);


        $query = $this->mMovRegNumericoActivo->getMovRegNumericoActivo('mrna', true, false);
        $query->innerJoin('mrna.DatMovRegnumerico mns');
        $query->innerJoin('mns.DatRegnumerico rn');
        $query->innerJoin('mns.DatMovRegnumericoActivo dmrna');
        $query->innerJoin('rn.DatProductoLogistica p');
        $query->addSelect(
            'rn.idregnumerico as idregnumerico,rn.nroserie as nroserie,
            p.idproducto as idproducto, mns.idmovregnumerico as idmovregnumerico,
            p.idestructuracomun as idestructuracomun, dmrna.fechaexpini as fechaexpini,
            dmrna.fechaexpfin as fechaexpfin, dmrna.idubicacion as idubicacion');
            $query->leftJoin("mrna.DatResponsable r"
        );
        $movregnum = new DatMovRegnumericoActivo();
        $pluginCount = 1;
        foreach ($this->listaPlugins as $pluginModel) {
            $pluginModel->initBaseMovRelation($movregnum);
            $pluginModel->addJoinModelMov($query, 'mrna', 'mrnap'.''.$pluginCount, true);
            ++$pluginCount;
        }

        if ($limit) {
            $query->limit($limit);
            $query->offset($start);
        }

        $query = $this->innerJoinResponsableRegNumerico($query, 'r', 'personaplug');
        return array("query" => $query);
    }

    public function getQueryDataVisualizarRegNumActivos($parametros, $alias = 'drna', $idsRegNumMostrar = array())
    {

        if (count($idsRegNumMostrar)) {
            $parametros['idsRegNumMostrar'] = $idsRegNumMostrar;
        }

        $maestroProducto = new MaestroProductoModel();
       // $query = parent::getSelectQuery($parametros);
        if ($this->idsubsistema == LogisticaGlobal::SUBSISTEMA_PATRIMONIO) {
            $query = parent::initBaseQuery($parametros);
        } else
            $query = parent::getSelectQuery($parametros);

        $query->addSelect($this->getSelectRegNumOperativo($this->baseAlias, $parametros['tree']));
        $query->addSelect("$alias.idregnumerico");
        $query->addSelect('rn.idproducto as idproducto');
        $query->addSelect('rn.nroserie as nroserie');
        $query->addSelect("natura.denominacion as naturaleza");
        $query->addSelect('ngsubg.denominacion as descripciongrupo');
        $query->addSelect("p.idestructuracomun as idestructura");

        $this->leftJoinDatAlternosRegNumerico($alias, $query);

        if (!$parametros['simple']) {
            $query = $this->innerJoinResponsableRegNumerico($query, 'datr', 'personaplug');
        }

        $query->innerJoin("$alias.DatRegnumerico rn");
        $query->innerJoin('rn.DatProductoLogistica p');

        if ($parametros["node"]) {
            unset($parametros["node"]);
        }
        $maestroProducto->addQueryNomIndicador($query, 'p', 'i', 'ih', true, 'ngsubg');
        if (is_array($parametros['idnaturaleza'])) {
            //condicion para que salgan solo los datos de patrimonio                          
            $query->andWhereIn("i.idnaturaleza", $parametros['idnaturaleza']);
            unset($parametros['idnaturaleza']);
        }

        $maestroProducto->addFiltersQueryIndicador($query, 'i', $parametros);
        $this->addLeftMarcaModelo($query, 'i', 'ih');
        $cfgIndicadorMedioModel = new ConfiguracionidentificadormedioModel();
        $query = $cfgIndicadorMedioModel->addJoinFromIndicador($query, 'i', 'cfgIndMed', true);

        $this->getWhere($query, 'drna', $parametros);
        $this->getWhereMarcaModelo($query, 'nmarc', 'nmod', $parametros);
        $this->getWhereMarcaModeloIndicador($query, 'nmarc', 'nmod', 'i', $parametros);
        parent::getWhere($query, 'rn', $parametros);

        if ($parametros['limit']) {
            $query->limit($parametros['limit']);
        }
        if ($parametros['start']) {
            $query->offset($parametros['start']);
        }
        
       if ($parametros['sort']) {
          if ($parametros['sort'] == 'codigo') {
            $parametros['sort'] = 'i.codigo';
          }
          if ($parametros['sort'] == 'numeropieza') {
            $parametros['sort'] = 'i.numeropieza';
          }
          if ($parametros['sort'] == 'estadoperacion') {
            $parametros['sort'] = 'drna.idestadoperacion';
          }

       }
        $sort = ($parametros['sort']) ? "{$parametros['sort']} {$parametros['dir']}," : " ";
        $query->orderBy("$sort $alias.idregnumerico DESC");

        return $query;
    }

    public function addLeftMarcaModelo($query, $aliasI, $aliasIH)
    {
        $query->addSelect(
            "(i.denominacion || ' '||((Case When ih.idmarca is not null "
            ."Then (nmarc.denominacion  || (Case When ih.idmodelo is not null Then ' - ' Else '' End)) "
            ."Else '' End)  || (Case When ih.idmodelo is not null "
            ."Then nmod.denominacion Else '' End))) as descripcionmarcamodelo"
        );

        $query->addSelect(
            "((Case When ih.idmarca is not null "
            ."Then (nmarc.denominacion  || (Case When ih.idmodelo is not null Then ' - ' Else '' End)) "
            ."Else '' End)  || (Case When ih.idmodelo is not null "
            ."Then nmod.denominacion Else '' End)) as marcamodelo"
        );
        $query->leftJoin("{$aliasIH}.NomMarca nmarc");
        $query->leftJoin("{$aliasIH}.NomModelo nmod");
        $query->innerJoin("{$aliasI}.NomNaturaleza natura");
    }

    public function getWhereMarcaModelo($query, $aliasMarca, $aliasModelo, $parametros)
    {
        if ($parametros['marcamodelo'] || $parametros['marca-modelo']) {
            if ($parametros['marca-modelo']) {
                $parametros['marcamodelo'] = $parametros['marca-modelo'];
            }
            $query->addWhere(
                "$aliasMarca.denominacion ILIKE '%{$parametros['marcamodelo']}%' OR "
                ."$aliasModelo.denominacion ILIKE '%{$parametros['marcamodelo']}%'"
            );
        }
        if ($parametros['marca']) {
            $query->addWhere(
                "$aliasMarca.denominacion ILIKE '%{$parametros['marca']}%'"
            );
        }
        if ($parametros['modelo']) {
            $query->addWhere(
                "$aliasModelo.denominacion ILIKE '%{$parametros['modelo']}%'"
            );
        }
    }

    public function getWhereMarcaModeloIndicador($query, $aliasMarca, $aliasModelo, $aliasIndicador, $parametros)
    {
        if ($parametros['descripcionmarcamodelo']) {
            $query->addWhere(
                "$aliasMarca.denominacion ILIKE '%{$parametros['descripcionmarcamodelo']}%' OR "
                ."$aliasModelo.denominacion ILIKE '%{$parametros['descripcionmarcamodelo']}%' OR "
                ."$aliasIndicador.denominacion ILIKE '%{$parametros['descripcionmarcamodelo']}%'"
            );
        }
    }

    public function getRegNumericoDat($parametros)
    {
        $queryDatos = $this->getQueryDataVisualizarRegNumActivos($parametros, 'drna');
        $datos = $queryDatos->fetchArray();
        return $datos;
    }

    /**
     *
     */
    public function getMediosDisponibles($parametros, $returnDql = false)
    { 
        if ($parametros['idestructuraop']) {
            $parametros['idarearesp'] = $parametros['idestructuraop'];
        }

        if ($parametros['limit']) {
            unset($parametros['limit']);
            unset($parametros['start']);
        }
        if ($parametros['criterio'] && $parametros['identificador']) {
            $parametros[$parametros['identificador']] = $parametros['criterio'];
            unset($parametros['criterio']);
        }
        $queryDatos = $this->getQueryDataVisualizarRegNumActivos($parametros, 'drna');
        $queryDatos->addWhere("drna.estaentidad = ?", array(1));
        $queryDatos->addSelect("nmarc.denominacion as marca");
        $queryDatos->addSelect("rna.actividad");
        $queryDatos->addSelect("nmod.denominacion as modelo");
        $queryDatos->andWhereNotIn("drna.idestadoperacion", array(9));
        if ($parametros['accion']) {
            $queryDatos->addWhere("i.idindicador <> 0");
        }

        $queryDatos = parent::getWhere($queryDatos, "rn", $parametros);

        if ($parametros['operativo']) {
            $queryDatos = NomencladoresActivosService::getJoinEstadoOperativo(
                $queryDatos, 'rn', 'estado', $parametros, false
            );
        } else {
            $queryDatos = NomencladoresActivosService::getJoinEstadoTecnico(
                $queryDatos, ($parametros['transporte']) ? 'rn' : 'drna', 'estado', $parametros, false
            );
        }

        if ($parametros['moduloCmp']) {
            new DatProductoModulo();
            $queryDatos->leftJoin('p.DatProductoModulo dpmmm');
            $queryDatos->addSelect('dpmmm.denominacion as denominacionPModulo');
            $queryDatos->addSelect('i.denominacion as denominacionIndicador');
        }

        /**
         *  Se busca el idoperacion del documento depreciación para excluirlos de la consulta
         */
        /*$depreciacion = "";
        $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(false, false, 'OPER_DEPRECIACION', false);

        if (count($operaciones)) {
            $idOperacion = $operaciones[0]['idoperacion'];
            $depreciacion = " AND doc.idoperacion <> $idOperacion";
        }*/

        if ($parametros['idestructuraop']) {
            $queryDatos->addWhere("drna.idarearesp = ?", array($parametros['idestructuraop']));
        }

        if ($parametros['arrayidregNum']) {
            $queryDatos->WhereIn("drna.idregnumerico", $parametros['arrayidregNum']);
        }

        if ($parametros['asignado']) {
            $queryDatos->addWhere("drna.asignado = ?", $parametros['asignado']);
        }

        $queryDatos->addWhere("rn.enproceso <> 1");
        /*$queryDatos->addWhere(
            "drna.idregnumerico NOT IN (
                SELECT dat_mov_reg.idregnumerico
                    FROM DatMovRegnumerico dat_mov_reg
                    INNER JOIN dat_mov_reg.DatMovimientos dat_mov ON dat_mov.idmovimiento = dat_mov_reg.idmovimiento
                    INNER JOIN dat_mov.DatDocumento doc ON doc.iddocumento = dat_mov.iddocumento
                    WHERE doc.cronologia is null AND drna.idregnumerico = dat_mov_reg.idregnumerico $depreciacion
            )"
        );*/


        //  Para que no carge los drna que son baja
        $queryDatos->addWhere("drna.esbaja = 0");
        $queryDatos->addWhere("drna.estaentidad = 1");
        $queryDatos->andWhereIn("drna.idestadoperacion",array(1,2,3));

        if ($parametros['criterio']) {
            $queryDatos->addWhere("i.denominacion iLike '%{$parametros['criterio']}%' ");
        }

        if ($parametros['idestructuraop']) {
            $queryDatos->addWhere("p.idestructura = ?", array($parametros['idestructuraop']));
        }

        if ($parametros['identidad']) {
            $queryDatos->addWhere("p.idestructuracomun = ?", array($parametros['identidad']));
        }

        if (!$parametros['_id'] && !$parametros['anode']) {
            if ($parametros['estree'] == true) {
                $queryDatos->addWhere("drna.idregnumerico = drna.idpadre");
            }
        }

        if ($returnDql) {
            return $queryDatos;
        }
        $total = $queryDatos->count();
        $datos = $queryDatos->fetchArray();

        if ($parametros['identidad'] && !$parametros['idestructurapadre']) {
            $parametros['idestructurapadre'] = $parametros['identidad'];
        }
        $cfg = $this->sConfActivos->getConfiguracionPG($parametros['idestructurapadre']);
        $prefijo = $cfg[0]['prefijo'];

        foreach ($datos as $key => $rn) {
            if ($rn['nroinventario'] != "") {
                $datos[$key]['nroinventario'] = $prefijo.'-'.$datos[$key]['nroinventario'];
            }
        }

        return array('datos' => $datos, 'total' => $total);
    }

    /**
     *
     */

    public function eliminarNroSerieEntradaforeach($param, $datOperacion)
    {
        foreach ($param['movimientos'] as $value) {
            $response = $this->eliminarSerieEntrada(
                $value->idregnumerico, $value->idmovregnumerico, $datOperacion['recepeliminar']
            );
            return $response;
        }
    }
    public function eliminarNroSerieEntrada($param)
    {
        if (count($param['movimientos'])) {
            $idOperacion = $param['idoperacion'];
            $datOperacion = $this->_mComunAFT->getDatosInterfazByIdOperacion($idOperacion);
            $response = $this->eliminarNroSerieEntradaforeach($param, $datOperacion);

            /*foreach ($param['movimientos'] as $value) {
                $response = $this->eliminarSerieEntrada(
                    $value->idregnumerico, $value->idmovregnumerico,$datOperacion['recepeliminar']
                );
            }*/
            //print_r($response);die;
            
            if($datOperacion['recepeliminar'] && $datOperacion['codigo'] == 'OPER_REC_TRAS_EXTER'){
                $this->mMovRegNum->decrementarCantidadMovimiento($param['idmovimiento'], count($param['movimientos']));                
            } else if (!$datOperacion['recepeliminar']) {
                $this->mMovRegNum->decrementarCantidadMovimiento($param['idmovimiento'], count($param['movimientos']));

                if ($param['modificadisponibilidad']) {
                    //$operacion = $this->_mComunAFT->getOperacionSobreMediosById($param['idoperacion']);
                    $signo = $datOperacion['signo'];
                    if ($datOperacion['tipo'] == 'no_entrada') {
                        if ($datOperacion['signo'] == '+') {
                            $signo = '-';
                        }
                        if ($datOperacion['signo'] == '-') {
                            $signo = '+';
                        }
                    }

                    if ($signo == '-' || $signo == '+' && $datOperacion['afectadisponible'] == 1) {
                        //  Modifico la disponibilidad del producto
                        $cantidad = count($param['movimientos']);
                        $movimiento = new MovimientoService();
                        $movimiento->modDisponibilidadMedios($param['idproducto'], $cantidad, $signo);
                    }
                }
            }

            return $response;
        }
    }

    /**
     *
     */
    public function innerJoinResponsableRegNumerico($query, $aliasLocal, $asExterno = 'dps')
    {
        if ($this->_mComunAFT->integradoPersona()) {

            $query = ServiciosRecursosHumanosHelper::__init()->agregarDqlDatosPersona(
                $query, $aliasLocal, $asExterno, false, array(), 'leftjoin'
            );

            $query->addSelect("{$asExterno}.idpersona as idresponsable");
            $query->addSelect(
                "((Case When {$asExterno}.nombre is not null Then ({$asExterno}.nombre"
                ."|| (Case When {$asExterno}.papel is not null Then ' ' Else '' End)) Else '' End)"
                ."||(Case When {$asExterno}.papel is not null Then ({$asExterno}.papel "
                ."|| (Case When {$asExterno}.sapel is not null Then ' ' Else '' End)) Else '' End)"
                ."||(Case When {$asExterno}.sapel is not null Then {$asExterno}.sapel Else '' End)) AS responsable"
            );
        } else {
            $query->leftJoin(
                "{$aliasLocal}.DatPersonaLocal {$asExterno} on {$asExterno}.idpersona = {$aliasLocal}.dpersona"
            );
            $query->addSelect("{$asExterno}.nombre as responsable");
        }
        return $query;
    }

    /**
     *
     */
    public function leftJoinDatAlternosRegNumerico($alias, &$query)
    {
        $query->addSelect('net.denominacion AS denomestadotecnico, net.idestatustecnico AS iddenomestadotecnico');
        $query->addSelect('nact.denominacion AS denomactividad');
        $query->addSelect('ntc_prim.denominacion AS colorprim');
        $query->addSelect('ntc_sec.denominacion AS colorsec');
        $query->addSelect('cat.denominacion AS categoria');
        $query->addSelect('eu.descripcion AS ubicacion');
        $query->addSelect('nact.denominacion AS actividad');
        $query->addSelect('nact.iddepreciacion AS iddepreciacion');
        $query->addSelect('datr.idpersona AS idpersona');


        $query->leftJoin("$alias.NomCategoriasproducto cat");
        $query->leftJoin("$alias.DatResponsable datr ON datr.idresponsable = $alias.idresponsable");
        $query->leftJoin("$alias.NomColor ntc_prim ON $alias.idcolorprim = ntc_prim.idcolor");
        $query->leftJoin("$alias.NomColor ntc_sec ON $alias.idcolorsec = ntc_sec.idcolor");
        $query->leftJoin("$alias.DatEstructuraubicacion eu");
        $query->leftJoin("$alias.NomEstatustecnico net");
        $query->leftJoin("$alias.NomActividadMedio nact");

    }

    /**
     * búsqueda avanzada para los activos incluye los atributos dinámicos
     * parámetros->
     *           -(obligatorio)busqAvanzada->valor = 2
     *           -(obligatorio)datos->datos para la busqueda que debe tener el idtabla la busqueda dinamica.
     *
     */
    public function getRegNumActivoBusqAvanzada($parametros)
    {
        $arrCritDinamicos = $this->mAtrDinamRegNum->getFiltrosBusqAvanzada($parametros['datos'][0]->elementosXtabla);

        $aux = (array) $parametros['datos'][0];
        unset($parametros['datos']);

        return $this->getQueryDataVisualizarRegNumActivos(array_merge($parametros, $aux), 'drna', $arrCritDinamicos);
    }

    /**
     * Busca si hay algún idpreoducto que ningún registro numérico este usando y lo borra.
     */
    protected function actualizarProdRegNumerico($arrIdesProductos)
    {
        $query = new Doctrine_Query();
        if (is_array($arrIdesProductos)) {

            // Buscar algún registro numérico que tenga ese producto, si no hay borro el producto
            foreach ($arrIdesProductos as $idProducto) {
                $cantidad = $query->select('COUNT(rn.idregnumerico) as cantidad')
                    ->from('DatRegnumerico rn')
                    ->where('rn.idproducto = ?', array($idProducto))
                    ->fetchArray();
                if ($cantidad[0]['cantidad'] == 0) {
                    $prod = Doctrine::getTable('DatProductoLogistica')->find($idProducto);
                    if ($prod) {
                        $prod->delete();
                    }
                }
            }
        } else {
            $cantidad = $query->select('COUNT(rn.idregnumerico) as cantidad')
                    ->from('DatRegnumerico rn')->where('rn.idproducto = ?', array($arrIdesProductos))->fetchArray();

            if ($cantidad[0]['cantidad'] == 0) {
                $prod = Doctrine::getTable('DatProductoLogistica')->find($arrIdesProductos);
                if ($prod) {
                    $prod->delete();
                }
            }
        }
        return true;
    }

    /**
     * Método para insertar las imágenes del registro numérico en el nomenclador de
     * imagen mod_datosmaestros.nom_imagenindicador.
     */
    public function insertarImagenes($arrIdesImagenes)
    {
        $result = array();
        foreach ($arrIdesImagenes as $value) {
            $idimagen = LogisticaImagenHelper::__init()->insertarImagenDb(
                $value, 'mod_logistica.nom_imagen', 'imagen', array(), false, 'mod_logistica.sec_nomimagen'
            );
            $result[] = $idimagen['idimagen'];
        }
        return $result;
    }

    /**
     * (obligatorio) datRegistroNumerico->obj de dat regnumerico
     * (obligatorio) arregloidsImagenes->arreglo de ids de imagenes
     */
    public function asociarImgRegNumerico($regNumerico, $arregloidsImagenes)
    {
        $coll = new Doctrine_Collection('DatImagenRegnumerico');

        foreach ($arregloidsImagenes as $idimagen) {
            $obj = new DatImagenRegnumerico();
            $obj->idimagen = $idimagen;
            $obj->idregnumerico = $regNumerico->idregnumerico;
            $coll->add($obj);
        }
        $coll->save();
    }

    /**
     * Método para eliminar las imágenes del registro numérico
     */
    public function eliminarImagenes($arregloIdimagen, $idRegNumerico)
    {
        $coll = new Doctrine_Collection('DatImagenRegnumerico');
        foreach ($arregloIdimagen as $idimagen) {
            $imagen = Doctrine::getTable('DatImagenRegnumerico')
                ->findByDql('idimagen = ? and idregnumerico = ?', array($idimagen, $idRegNumerico));
            $coll->add($imagen);
        }
        $coll->delete();
    }

    /**
     * FIXME
     */
    public function actualizarRegNumByIdDocumento($idDocumento, $idOperacion)
    {

        $valorContable = 1;

        if (!$idOperacion && $idDocumento) {
            $doc = Doctrine::getTable('DatDocumento')->find($idDocumento);
            $idOperacion = $doc->idoperacion;
        }

        // Solo para las aperturas y altas que replique el valor de adquisicion en el valor contable
        if ($idOperacion) {
            //$operacion = ServiciosConfiguracionGeneralHelper::__init()->obtenerOperaciones(0, 0, 0, $idOperacion);
            $operacion = $this->_mComunAFT->getDatosInterfazOperacion(
                false, false, false, false, false, 0, false, $idOperacion
            );
            if ($operacion[0]['codigooperacion'] == 'OPER_APERTURA' || $operacion[0]['codigooperacion'] == 'OPER_AL'
                .'TA' || $operacion[0]['codigooperacion'] == 'OPER_MEDIOPROPIOS') {
                $valorContable = 2;

                $query = new Doctrine_Query();
                $query->update('DatMovRegnumericoActivo movreg')
                    ->set('movreg.valorcontable', 'movreg.valoradquisicion')
                    ->where(
                        "movreg.idmovregnumerico
                            IN (SELECT dmrn1.idmovregnumerico
                                 FROM DatMovRegnumerico dmrn1
                                 INNER JOIN  dmrn1.DatMovimientos dm1 ON dm1.idmovimiento = dmrn1.idmovimiento
                                 WHERE dm1.iddocumento = $idDocumento)"
                    )->execute();
            }
        }



        /* $sqlRn = new Doctrine_Query();
          $sqlRn->select("reg.*, dm1.idproducto as idproductoMov, dmrn.idmovregnumerico")
          ->from("DatMovRegnumerico dmrn")
          ->innerJoin("dmrn.DatMovRegnumericoActivo dmrna1 ON dmrn.idmovregnumerico = dmrna1.idmovregnumerico")
          ->innerJoin("dmrn.DatRegnumerico reg ON dmrn.idregnumerico = reg.idregnumerico")
          ->innerJoin("dmrn.DatMovimientos dm1 ON dm1.idmovimiento = dmrn.idmovimiento")
          ->where(" dm1.iddocumento = $idDocumento");

          $arrIdesRegNumerico = $sqlRn->fetchArray();
          //print_r($arrIdesRegNumerico[0]);


          $colecctionRns = new Doctrine_Collection('DatRegnumerico');
          foreach ($arrIdesRegNumerico as $registros) {
          $objRn = new DatRegnumerico();
          $objRn->synchronizeWithArray($registros['DatRegnumerico']);
          $objRn->assignIdentifier($registros['DatRegnumerico']['idregnumerico']);
          $objRn->idproducto = $registros['idproductoMov'];
          $colecctionRns->add($objRn);
          }
          $colecctionRns->save(); */

        //  Para saber si se esta aprobando una baja o no.
        $baja = ($operacion[0]['codigooperacion'] &&
            (strpos($operacion[0]['codigooperacion'], 'OPER_BAJA') !== false || $operacion[0]['codigooperacion'] == 'OPER_PERDIDA')) ? 1 : 0;

        if ($operacion[0]['codigooperacion'] == 'OPER_AJUSTE_FALTANTE') {
            $baja = 1;
        }

        if ($operacion[0]['codigooperacion'] == 'OPER_ALQUILER' || $operacion[0]['codigooperacion'] == 'OPER_ENVI'
            .'ADO_REPARAR') {
            $estaEnLaEntidad = 0;
        } else {
            $estaEnLaEntidad = 1;
        }



        // --------- ESTO SE COMENTAREO PARA PROBAR LO DE LAS FUNCIONES EN BD QUE HACEN ESTA MISMA LOGICA---------
        // 1.07 minutos para 100 registros (el metodo aprobar entero)
        /* $conn = Zend_Registry::get('conexion');
          $conn->fetchAll("SELECT * FROM \"mod_logactivofijotangible\".\"f_actualizarrnfromdoc\"($idDocumento,
        'dat_movregnumericoactivo', 'dat_regnumericoactivo')");

          foreach ($this->listaPlugins as $plug) {
          $plug->replicarMovrnToRn($conn, $idDocumento);
          }

          $conn->fetchAll("SELECT * FROM \"mod_logactivofijotangible\".\"f_afeteraprobardoc\"($idDocumento, 'true',
        $baja, $estaEnLaEntidad, {$operacion[0]['idestadoperacion']})");
         */
        //die('mierda');
        // 2.52 minutos para 100 registros ((el metodo aprobar entero)

        $sqlActivo = new Doctrine_Query();
        $sqlActivo->select("rn.*, rna.*, mrna.*, mrn.*, dm1.idproducto as idproductoMov")
            ->from("DatMovRegnumericoActivo mrna")
            ->innerJoin("mrna.DatMovRegnumerico mrn ON mrna.idmovregnumerico = mrn.idmovregnumerico")
            ->innerJoin("mrn.DatRegnumerico rn ON mrn.idregnumerico = rn.idregnumerico")
            ->innerJoin("rn.DatRegnumericoActivo rna ON rna.idregnumerico = rn.idregnumerico")
            ->innerJoin("mrn.DatMovimientos dm1 ON dm1.idmovimiento = mrn.idmovimiento")
            ->where(" dm1.iddocumento = $idDocumento");

        $pluginCount = 1;
        $movregnum = new DatMovRegnumericoActivo();

        foreach ($this->listaPlugins as $pluginModel) {
            $pluginModel->initBaseMovRelation($movregnum);
            $pluginModel->addJoinModelMov($sqlActivo, 'mrna', 'mrnap'.''.$pluginCount, true);
            ++$pluginCount;
        }
        $rnas = $sqlActivo->fetchArray();
        
        $colecctionRns = new Doctrine_Collection('DatRegnumerico');
        foreach ($rnas as $activos) {
            $objRn = new DatRegnumerico();
            $objRn->synchronizeWithArray($activos['DatMovRegnumerico']['DatRegnumerico']);
            $objRn->assignIdentifier($activos['DatMovRegnumerico']['DatRegnumerico']['idregnumerico']);
            $objRn->idproducto = $activos['idproductoMov'];

            $datos = $activos['DatMovRegnumerico']['DatRegnumerico']['DatRegnumericoActivo'];
            $objRn->DatRegnumericoActivo->assignIdentifier($datos['idregnumerico']);
            $objRn->DatRegnumericoActivo->synchronizeWithArray($datos);
            $objRn->DatRegnumericoActivo->synchronizeWithArray($activos);
            if ($valorContable == 2) {
                $objRn->DatRegnumericoActivo->valorcontable = $activos['valoradquisicion'];
            }

			
			if($operacion[0]['codigooperacion'] == 'OPER_MOD_VALOR' || $operacion[0]['codigooperacion'] == 'OPER_MOD_VALOR_UH'){
				$objRn->DatRegnumericoActivo->valorcontable +=
					(is_numeric($activos['diferenciavalor'])) ? $activos['diferenciavalor'] : 0;
				$objRn->DatRegnumericoActivo->valorcontablealternativo +=
					(is_numeric($activos['diferenciavaloralternativo'])) ? $activos['diferenciavaloralternativo'] : 0;
				$objRn->DatRegnumericoActivo->depreciacionacumulada +=
					(is_numeric($activos['diferenciadepreciacion'])) ? $activos['diferenciadepreciacion'] : 0;
				$objRn->DatRegnumericoActivo->depreciacionacumuladaalternativo +=
					(is_numeric($activos['diferenciadepreciacionalternativo'])) ? $activos['diferenciadepreciacionalternativo']: 0;
			}else if($operacion[0]['codigooperacion'] == 'OPER_MOD_VALOR_DIS' || $operacion[0]['codigooperacion'] == 'OPER_MOD_VALOR_DIS_UH'){
				$objRn->DatRegnumericoActivo->valorcontable -=
					(is_numeric($activos['diferenciavalor'])) ? $activos['diferenciavalor'] : 0;
				$objRn->DatRegnumericoActivo->valorcontablealternativo -=
					(is_numeric($activos['diferenciavaloralternativo'])) ? $activos['diferenciavaloralternativo'] : 0;
				$objRn->DatRegnumericoActivo->depreciacionacumulada -=
					(is_numeric($activos['diferenciadepreciacion'])) ? $activos['diferenciadepreciacion'] : 0;
				$objRn->DatRegnumericoActivo->depreciacionacumuladaalternativo -=
					(is_numeric($activos['diferenciadepreciacionalternativo'])) ? $activos['diferenciadepreciacionalternativo']: 0;
			}
            

            $objRn->DatRegnumericoActivo->esbaja = $baja;
            $objRn->DatRegnumericoActivo->estaentidad = $estaEnLaEntidad;
            $objRn->DatRegnumericoActivo->idestadoperacion = $operacion[0]['idestadoperacion'];

            // Esto es para conocer que el registro esta siendo usado en un documento que no esta aprobado.
            $objRn->enproceso = 0;
            
            

            foreach ($this->listaPlugins as $plug) {
                $plug->beforeSave($objRn->DatRegnumericoActivo, $activos);
            }
            $colecctionRns->add($objRn);
        }
        $colecctionRns->save(null, false);
        
        if($baja == 1 ||
                $operacion[0]['codigooperacion'] == 'OPER_TRASLADO_EXTER' ||
                $operacion[0]['codigooperacion'] == 'OPER_REC_TRAS_EXTER'){
                $sqlUpdateMovRn = new Doctrine_Query();
                $sqlUpdateMovRn->update('DatMovRegnumericoActivo')
                    //->set('depreciacionacumulada', 'depreciacion')
                    //->set('depreciacionacumuladaalternativo', 'depreciacioncuc')
                    ->set('depreciacion', 'depreciacionacumulada')
                    ->set('depreciacioncuc','depreciacionacumuladaalternativo')

                    ->where("idmovregnumerico IN "
                        . "("
                        . "SELECT mrn.idmovregnumerico FROM DatMovimientos m "
                        . "INNER JOIN DatMovRegnumerico mrn on mrn.idmovimiento = m.idmovimiento"
                        . "WHERE m.iddocumento = $idDocumento"
                        . ")");
        }
    }

    /**
     * FIXME YA HAY UN METODO PARECIDO EN DEPRECIACION
     */
    public function getBuscarRegNumDepreciado($idregnumericodata, $idEstructura)
    {
        $query = Doctrine_Query::create();
        $query->FROM('CfgParametrosGenerales pg');
        $query->addSELECT('pg.depreciacion');
        $query->addWhere('pg.idestructura = ?', array($idEstructura));
        $sistema = $query->fetchArray();

        if ($sistema[0]['depreciacion'] == null || $sistema[0]['depreciacion'] == 0) {
            $idregnumdepreciados = 0;
        } else {
            $obj = new DepreciacionService();
            $idregnumdepreciados = $obj->getBuscarRegNumDepreciado($idregnumericodata, $idEstructura);
        }

        return $idregnumdepreciados;
    }

    /**
     *
     */
    public function getTrasladarIdRegNum($arrIdsRegNumTraslados, $parametros)
    {
        $mediosDisponibles = self::getMediosDisponibles($parametros);

        // Recorro los datos seleccionados y obtengo los datos que hacen falta para trasladarlos y al final salvo.
        for ($i = 0; $i < count($arrIdsRegNumTraslados); $i++) {
            for ($j = 0; $j < count($mediosDisponibles['datos']); $j++) {
                if ($arrIdsRegNumTraslados[$i] == $mediosDisponibles['datos'][$j]['idregnumerico']) {

                    //  Para cuando es una hoja
                    if ($mediosDisponibles['datos'][$j]['esmodulo'] == 1) {

                        $arrIdsRegNum[0] = $mediosDisponibles['datos'][$j]['idpadremodulo'];
                        $distinto['idpadremodulo'] = array_diff($arrIdsRegNum, $arrIdsRegNumTraslados);

                        //  Si el padre no esta seleccionado le pongo el id de padre null
                        if (count($distinto['idpadremodulo']) != 0) {

                            $modulo = Doctrine::getTable('DatRegnumericoActivo')->find($arrIdsRegNumTraslados[$i]);
                            $modulo->esmodulo = 1;
                            $modulo->asignado = 1;
                            $modulo->ordenizq = null;
                            $modulo->ordender = null;
                            $modulo->idpadre = null;
                            $modulo->save();

                            $this->ordenarArbolModulosRegNumericos();
                        }
                    }

                    //  Para cuando es un padre y no es raíz, busco los hijos que no esten en la selección
                    if ($mediosDisponibles['datos'][$j]['esmodulo'] != 1 && $mediosDisponibles['datos'][$j]
                        ['idpadremodulo']) {
                        for ($h = 0; $h < count($mediosDisponibles['datos']); $h++) {

                            //  No esta en los elementos seleccionados, es padre y no es raíz
                            if ($mediosDisponibles['datos'][$j]['idregnumerico'] == $mediosDisponibles['datos'][$h]
                                ['idpadremodulo'] && $mediosDisponibles['datos'][$h]['esmodulo'] != 1) {
                                $arrIdsRegNum[0] = $mediosDisponibles['datos'][$h]['idregnumerico'];
                                $distinto['idregnumerico'] = array_diff($arrIdsRegNum, $arrIdsRegNumTraslados);

                                if (count($distinto['idregnumerico']) != 0) {
                                    $modulo = Doctrine::getTable('DatRegnumericoActivo')
                                        ->find($mediosDisponibles['datos'][$h]['idregnumerico']);
                                    $modulo->idpadre = $mediosDisponibles['datos'][$h]['idregnumerico'];
                                    $modulo->ordenizq = null;
                                    $modulo->ordender = null;
                                    $modulo->save();
                                    $this->ordenarArbolModulosRegNumericos();
                                }
                            }

                            //  No esta en los elementos seleccionados y es una hoja
                            if ($mediosDisponibles['datos'][$j]['idregnumerico'] == $mediosDisponibles['datos'][$h]
                                ['idpadremodulo'] && $mediosDisponibles['datos'][$h]['esmodulo'] == 1) {
                                $arrIdsRegNum[0] = $mediosDisponibles['datos'][$h]['idregnumerico'];
                                $distinto['idregnumerico'] = array_diff($arrIdsRegNum, $arrIdsRegNumTraslados);
                                if (count($distinto['idregnumerico']) != 0) {
                                    $modulo = Doctrine::getTable('DatRegnumericoActivo')
                                        ->find($mediosDisponibles['datos'][$h]['idregnumerico']);
                                    $modulo->asignado = 1;
                                    $modulo->idpadre = null;
                                    $modulo->ordenizq = null;
                                    $modulo->ordender = null;
                                    $modulo->save();
                                    $this->ordenarArbolModulosRegNumericos();
                                }
                            }
                        }
                    }
                }
            }
        }
        $this->arrayIdRegNumTraslado($arrIdsRegNumTraslados);
        /* for ($m = 0; $m < count($arrIdsRegNumTraslados); $m++) {
          $modulo = Doctrine::getTable('DatRegnumericoActivo')->find($arrIdsRegNumTraslados[$m]);
          $modulo->ordenizq = null;
          $modulo->ordender = null;
          $modulo->save();
          $this->ordenarArbolModulosRegNumericos();
          } */
        return 1;
    }

    public function arrayIdRegNumTraslado($arrIdsRegNumTraslados)
    {
        for ($m = 0; $m < count($arrIdsRegNumTraslados); $m++) {
            $modulo = Doctrine::getTable('DatRegnumericoActivo')->find($arrIdsRegNumTraslados[$m]);
            $modulo->ordenizq = null;
            $modulo->ordender = null;
            $modulo->save();
            $this->ordenarArbolModulosRegNumericos();
        }
    }

    /**
     *
     */
    public function getHacerMovDeRegNumDepreciados($tipoMedio, $idDocumento)
    {
        $cDatRegnumerico = 'DatRegnumerico';
        $cDatProductoLogistica = 'DatProductoLogistica';

        if (count($tipoMedio) > 0) {
            foreach ($tipoMedio as $key => $idRegNumerico) {
                $objDatRegnumericoActivo = Doctrine::getTable('DatRegnumericoActivo')->find($idRegNumerico);
                $objDatRegnumericoActivo->$cDatRegnumerico->$cDatProductoLogistica;
                $idprod = $objDatRegnumericoActivo->$cDatRegnumerico->$cDatProductoLogistica->idprod;
                $datos = $objDatRegnumericoActivo->toArray();

                unset($datos['DatRegnumerico']);
                $datos['idprod'] = $idprod;
                $valores[$key] = $datos;
            }

            $doc = Doctrine::getTable('DatDocumento')->find($idDocumento);
            new DatMovRegnumerico();
            new DatMovRegnumericoActivo();
            $mov = new MovimientoService();
            $datDocumento = $mov->crearMovimiento($valores, $doc);
            $datDocumento->save();
        }
        return 1;
    }

    /**
     *
     */
    public function getDepreciarMedios($idRegNumerico)
    {
        $index = 0;
        if (!is_array($idRegNumerico)) {
            $obj = new DepreciacionService();
            $datos = $obj->depreciarByArrIdesRegNumericos($idRegNumerico);
            return $datos;
        } else {
            foreach ($idRegNumerico as $id) {
                if ($id != null) {
                    $idRegNumerico[$index] = $id->idregnumerico;
                }
                $index++;
            }
            $obj = new DepreciacionService();
            $datos = $obj->depreciarByArrIdesRegNumericos($idRegNumerico);
            return $datos;
        }
    }

    /**
     *
     */
    public function cargarGridCentral($parametros)
    {
        $query = $this->getQueryDataVisualizarRegNumActivos($parametros);
        $query->innerJoin("p.DatMovimientos mov");
        $query->innerJoin("mov.DatDocumento doc");
        $query->addWhere("doc.estado = 3 and drna.estaentidad = 1");

        $arrIdesEstructuras = $this->_mComunAFT->getIdEstructurasHijas($parametros['idestructura'], true);

        $query->andWhereIn("p.idestructura", $arrIdesEstructuras);
        if ($parametros['idregnumerico']) {
            $query->addWhere("drna.idregnumerico = {$parametros['idregnumerico']}");
        }
        return array("datos" => $query->fetchArray(),
            "total" => $query->count());
    }

    /**
     *
     */
    public function getQueryRegNumActivo($asLoc = 'rna', $select = false, $parametros = array())
    {
        $query = new Doctrine_Query();
        $query->from("DatRegnumericoActivo {$asLoc}");

        if ($select) {
            $query->addSelect($this->getQuerySelectFields($asLoc));
        }
        $query->addSelect("$asLoc.idregnumerico");

        if (count($parametros)) {
            $this->getWhere($query, $asLoc, $parametros);
        }

        return $query;
    }

    /*
     *  Importar datos desde el excel.
     * */

    public function importarDatos($conn, $idEstructura, $idDocumento, $idCentroCosto)
    {
        $inserRegNumerico = "
            INSERT INTO mod_logactivofijotangible.dat_registronumerico(idregnumerico, idproducto, nroserie, enproceso)
            select dimp.idimportar, dp.idproducto, dimp.nroserie, 1 from mod_logistica.dat_producto dp
            inner join mod_logactivofijotangible.dat_importartmp dimp on dp.idindicador = dimp.idindicador
            where dp.idestructura = ".$idEstructura;
        $conn->execute($inserRegNumerico);

        $insertarRegNumericoActivo = "
            INSERT INTO mod_logactivofijotangible.dat_regnumericoactivo(
            idregnumerico, denominacion,idgruposubgrupo,idnaturaleza, actividad, colorprim, colorsec,denomestadotecnico, vidautil, tasafiscal, porcientorecuperacion, categoria, denomarearesp, fechaexpini) 
            select distinct rn.idregnumerico,dimp.denominacion,
            ngsg.idgruposubgrupo,natu.idnaturaleza,act.denominacion,dimp.colorprim, dimp.colorsec,dimp.denomestadotecnico,dimp.vidautil,dimp.tasafiscal, dimp.porcientorecuperacion, dimp.categoria, dimp.denomarearesp, dimp.fechaexpini
            from mod_logistica.dat_producto dp
            inner join mod_logactivofijotangible.dat_importartmp dimp on dp.idindicador = dimp.idindicador
            left join mod_logactivofijotangible.nom_actividad act on act.denominacion like dimp.actividad
            inner join mod_logactivofijotangible.dat_registronumerico rn on dp.idproducto = rn.idproducto
            left join mod_datosmaestros.nom_gruposubgrupo ngsg on ngsg.denominacion like dimp.gruposubgrupo
            left join mod_datosmaestros.nom_naturaleza natu on natu.denominacion like dimp.naturaleza
            where dp.idestructura = ".$idEstructura." AND rn.idregnumerico = dimp.idimportar
            ";
        $conn->execute($insertarRegNumericoActivo);
        
        $insertDatMovRegNumerico = "
            INSERT INTO mod_logactivofijotangible.dat_movregnumerico(idregnumerico, idmovimiento)
            select distinct rn.idregnumerico, m.idmovimiento
            from mod_logistica.dat_producto dp
            inner join mod_logistica.dat_movimiento m on dp.idproducto = m.idproducto
            inner join mod_logactivofijotangible.dat_importartmp dimp on dp.idindicador = dimp.idindicador
            inner join mod_logactivofijotangible.dat_registronumerico rn on dp.idproducto = rn.idproducto
            where dp.idestructura = ".$idEstructura."
            AND rn.idregnumerico = dimp.idimportar
            AND m.iddocumento = ".$idDocumento;
        $conn->execute($insertDatMovRegNumerico);

        $insertDatMovRegNumericActivo = "
            INSERT INTO mod_logactivofijotangible.dat_movregnumericoactivo
            (idmovregnumerico, idestatustecnico, idarearesp, idcentrocosto, idcolorprim, idcolorsec,
            idactividad, fechaadq, tasafiscal, porcientorecuperacion, vidautil, valoradquisicion,
            depreciacionacumulada, valorcontable, annofabricacion, fechaexpini, fechaexpfin, idcategoria,
            recursoconsumido, cantidadrecursoconsumido, nroinventario, fechainicialgarantia, fechafingarantia,
            recursoconsumidomax, valorcontablealternativo, valoradquisicionalternativo, denominacion,idgruposubgrupo,idnaturaleza,actividad)
            select mrn.idmovregnumerico, dimp.idestatustecnico,
            ".$idEstructura.", ".$idCentroCosto.", dimp.idcolorprim, dimp.idcolorsec,
            dimp.idactividad, dimp.fechaadq, dimp.tasafiscal,
            dimp.porcientorecuperacion, dimp.vidautil, dimp.valoradquisicion, dimp.depreciacionacumulada,
            dimp.valorcontable, dimp.annofabricacion, dimp.fechaexpini, dimp.fechaexpfin, dimp.idcategoria,
            dimp.recursoconsumido, dimp.cantidadrecursoconsumido, dimp.nroinventario, dimp.fechainicialgarantia,
            dimp.fechafingarantia, dimp.recursoconsumidomax, dimp.valorcontablealternativo, dimp.valoradquisicionalternativo
            ,dimp.denominacion,ngsg.idgruposubgrupo,natu.idnaturaleza,dimp.actividad
            from mod_logistica.dat_producto dp
            inner join mod_logistica.dat_movimiento m on dp.idproducto = m.idproducto
            inner join mod_logactivofijotangible.dat_importartmp dimp on dp.idindicador = dimp.idindicador
            inner join mod_logactivofijotangible.dat_registronumerico rn on dp.idproducto = rn.idproducto
            inner join mod_datosmaestros.nom_gruposubgrupo ngsg on ngsg.denominacion like dimp.gruposubgrupo
            inner join mod_datosmaestros.nom_naturaleza natu on natu.denominacion like dimp.naturaleza
            inner join mod_logactivofijotangible.dat_movregnumerico mrn on m.idmovimiento = mrn.idmovimiento
            inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
            left join mod_datosmaestros.nom_gruposubgrupohoja gsh on gsh.idgruposubgrupo = ih.idgruposubgrupo
            where dp.idestructura = ".$idEstructura."
            AND rn.idregnumerico = dimp.idimportar
            AND m.iddocumento = ".$idDocumento."
            AND mrn.idregnumerico = rn.idregnumerico";

        $conn->execute($insertDatMovRegNumericActivo);
        foreach ($this->listaPlugins as $plug) {
            $plug->importarDatosExcel($conn, $idEstructura, $idDocumento);
        }
    }

    /*
     * Esta funcion se utiliza para validar los datos que se insertan en las tablas temporales de los plugins los
     * datos que son importados.
     * */

    public function validarAddDatosTemporalesPlugins($datos)
    {
        foreach ($this->listaPlugins as $plug) {
            $resp = $plug->ValidarInsertarTablaTemporal($datos);
            // return array("cod" => 5, "cadena" => 'el valor de la fecha de fin de garant\xeda');
            if ($resp["cod"] == 5) {
                return $resp;
            }
        }
    }

    /*
     * Esta funcion se utiliza para insertar en las tablas temporales de los plugins los datos que son
     * importados.
     * */

    public function addDatosTablasTemporalesPlugins($datos)
    {
        foreach ($this->listaPlugins as $plug) {
            $plug->InsertarTablaTemporal($datos);
        }
    }

    /* public function getConteoRegNumericosEntidadService($idestructuraop, $parametros){

      } */

    public function getConteoRegNumericosEntidadService($idestructuraop, $parametros)
    {
        $sRegNumActivo = new RegNumActivoService();
        $estructura = 'Estructura';
        if (!$idestructuraop) {
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructuraop[] = $global->$estructura->idestructura;
        }
        unset($parametros['arrayIdarearesp']);
        $query = $sRegNumActivo->getQueryDataVisualizarRegNumActivos($parametros);

        $query->addSelect('p.idproducto');
        $query->addSelect('rn.idregnumerico');

        $mMovRegNum = new MovRegNumericoModel();
        $mMovRegNum->addJoinModel($query, 'rn', 'movrn', 1);

        $query->innerJoin('movrn.DatMovimientos mov');
        $query->innerJoin('movrn.DatMovRegnumericoActivo mrna');
        $query->innerJoin('mov.DatDocumento d');
        $query->addSelect('nmarc.denominacion as marca');
        $query->addSelect('nmod.denominacion as modelo');

        if ($parametros['tipomedio']) {
            $nomIndicador = new NomIndicador();
            $array[] = array('cardinalidad' => 'one',
                'relation' => 'ConfTipomedionaturaleza',
                'properties' => array('local' => 'idnaturaleza',
                    'foreign' => 'idnaturaleza'));
            LogisticaDoctrineHelper::__init()->tryInyectRelactions($nomIndicador, $array);

            $query->innerJoin('i.ConfTipomedionaturaleza conftipom');
            $query->addWhere('conftipom.tipo =?', $parametros['tipomedio']);
        }

        $movregnum = new DatMovRegnumericoActivo();
        foreach ($this->listaPlugins as $pluginModel) {
            $pluginModel->initBaseMovRelation($movregnum);
            $alias = 'mrnap'.''.$pluginCount;
            $pluginModel->addJoinModelMov($query, 'mrna', $alias, false);
            $pluginModel->getQuerySelectFields('mrnap');
            ++$pluginCount;
        }
        $datos = $query->fetchArray();
        $arrEstadosOperaciones = $this->_mComunAFT->GetArrEstadosoperacion();
        foreach ($datos as $key => $registro) {
            $datos[$key]['estadooperacion'] = $arrEstadosOperaciones[$datos[$key]['idestadoperacion']];
            $retur = $registro;
            unset($retur);
        }
        return array('datos' => (count($datos) > 0) ? $datos : array(), 'cantidad' => $query->count());
    }

    public function getCargarSerieDisponible($parametros, $returnDql)
    {
        if ($parametros['idestructuraop']) {
            $parametros['idarearesp'] = $parametros['idestructuraop'];
        }

        if ($parametros['limit']) {
            $lim = $parametros['limit'];
            $sta = $parametros['start'];
            unset($parametros['limit']);
            unset($parametros['start']);
        }
        if ($parametros['criterio'] && $parametros['identificador']) {
            $parametros[$parametros['identificador']] = $parametros['criterio'];
            unset($parametros['criterio']);
        }
        $queryDatos = $this->getQueryDataVisualizarRegNumActivos($parametros, 'drna');

        $queryDatos->addWhere("drna.estaentidad = ?", array(1));
        $queryDatos->addWhere("drna.idestadoperacion = ?", array(1));
        $queryDatos->addSelect("nmarc.denominacion as marca");
        $queryDatos->addSelect("nmod.denominacion as modelo");
        $queryDatos = NomencladoresActivosService::getJoinEstadoTecnico(
            $queryDatos, ($parametros['transporte']) ? 'rn' : 'drna', 'estado', $parametros, false
        );
        $queryDatos = parent::getWhere($queryDatos, "rn", $parametros);
        $depreciacion = "";

        /*$operaciones = $this->_mComunAFT->getDatosInterfazOperacion(false, false, 'OPER_DEPRECIACION', false);
        if (count($operaciones)) {
            $idOperacion = $operaciones[0]['idoperacion'];
            $depreciacion = " AND doc.idoperacion <> $idOperacion";
        }*/
       // print_r($queryDatos->getSqlQuery());die;
        /*$queryDatos->addWhere(
            "drna.idregnumerico NOT IN (
                SELECT dat_mov_reg.idregnumerico
                    FROM DatMovRegnumerico dat_mov_reg
                    INNER JOIN dat_mov_reg.DatMovimientos dat_mov ON dat_mov.idmovimiento = dat_mov_reg.idmovimiento
                    INNER JOIN dat_mov.DatDocumento doc ON doc.iddocumento = dat_mov.iddocumento
                    INNER JOIN dat_mov_reg.DatRegnumerico rn2 on rn2.idregnumerico = dat_mov_reg.idregnumerico
                    INNER JOIN rn.DatRegnumericoActivo rnaft on rn.idregnumerico = rnaft.idregnumerico
                    WHERE rnaft.idestadoperacion <> 1 and drna.idregnumerico = dat_mov_reg.idregnumerico $depreciacion
            )"
        );*/

        /*$queryDatos->addWhere(
            "drna.idregnumerico NOT IN (
                SELECT dat_mov_reg2.idregnumerico
                    FROM DatMovRegnumerico dat_mov_reg2
                    INNER JOIN dat_mov_reg.DatMovimientos dat_mov2 ON dat_mov2.idmovimiento = dat_mov_reg2.idmovimiento
                    INNER JOIN dat_mov.DatDocumento doc2 ON doc2.iddocumento = dat_mov2.iddocumento
                    INNER JOIN dat_mov_reg.DatRegnumerico rn1 on rn1.idregnumerico = dat_mov_reg2.idregnumerico
                    INNER JOIN rn.DatRegnumericoActivo rnaft2 on rn1.idregnumerico = rnaft2.idregnumerico
                    WHERE doc2.estado in (1,2)
            )"
        );*/
        $queryDatos->addWhere(
            "drna.idregnumerico NOT IN (
                SELECT dat_mov_reg2.idregnumerico
                    FROM DatMovRegnumerico dat_mov_reg2
                    INNER JOIN dat_mov_reg2.DatMovimientos dat_mov2 ON dat_mov2.idmovimiento = dat_mov_reg2.idmovimiento
                    INNER JOIN dat_mov2.DatDocumento doc2 ON doc2.iddocumento = dat_mov2.iddocumento                    
                    WHERE doc2.estado in (1,2)
            )"
        );

        $queryDatos->addWhere("drna.esbaja = 0");
        $queryDatos->addWhere("drna.estaentidad = 1");
        if ($parametros['criterio']) {
            $queryDatos->addWhere("i.denominacion iLike '%{$parametros['criterio']}%' ");
        }
        $queryDatos->limit(($lim) ? $lim : 30);
        $queryDatos->offset(($sta) ? $sta : 0);

        if ($returnDql) {
            return $queryDatos;
        }
        
        //print_r($queryDatos->getSqlQuery());die;
        
        $total = $queryDatos->count();
        $datos = $queryDatos->fetchArray();

        $cfg = $this->sConfActivos->getConfiguracionPG($parametros['idestructurapadre']);
        $prefijo = $cfg[0]['prefijo'];
        $datos = $this->getCargarSerieDisponibleforeach($datos, $prefijo);

        return array('datos' => $datos, 'total' => $total);
    }

    public function getCargarSerieDisponibleforeach($datos, $prefijo)
    {
        // foreach ($datos as $key => $rn) {
        //     if ($rn['nroinventario'] != "") {
        //         $datos[$key]['nroinventario'] = $prefijo.'-'.$datos[$key]['nroinventario'];
        //     }
        // }
        return $datos;
    }

    public function getArrIdsRegNumericosByIddocumento($idDocumento)
    {

        $sqlRn = new Doctrine_Query();
        $sqlRn->select("rn.idregnumerico")
            ->from("DatRegnumerico rn")
            ->innerJoin('rn.DatMovRegnumerico dmrn')
            ->innerJoin("dmrn.DatMovimientos dm1 ON dm1.idmovimiento = dmrn.idmovimiento")
            ->where(" dm1.iddocumento = $idDocumento");
        $datos = array();
        foreach ($sqlRn->fetchArray() as $value) {
            array_push($datos, $value['idregnumerico']);
        }
        return $datos;
    }

    public function setValoresDepreInMovRnaFromRnaDadoDoc($idDocumento)
    {
            $sql = " UPDATE mod_logactivofijotangible.dat_movregnumericoactivo mrn

                    SET 
                    depreciacionacumulada = (
                      SELECT rna.depreciacionacumulada
                      FROM mod_logactivofijotangible.dat_regnumericoactivo rna
                      INNER JOIN mod_logactivofijotangible.dat_movregnumerico mr on 
                      mr.idregnumerico = rna.idregnumerico and mrn.idmovregnumerico = mr.idmovregnumerico

                    ),
                    depreciacionacumuladaalternativo = (
                        SELECT rna1.depreciacionacumuladaalternativo
                        FROM mod_logactivofijotangible.dat_regnumericoactivo rna1
                        INNER JOIN mod_logactivofijotangible.dat_movregnumerico mr1 on 
                        mr1.idregnumerico = rna1.idregnumerico and mrn.idmovregnumerico = mr1.idmovregnumerico

                    )
                    WHERE idmovregnumerico IN 
                        (
                          SELECT dmrn1.idmovregnumerico
                          FROM mod_logactivofijotangible.dat_movregnumerico dmrn1
                          INNER JOIN mod_logistica.dat_movimiento dm1 ON (dm1.idmovimiento = dmrn1.idmovimiento)
                          WHERE (dm1.iddocumento = $idDocumento)
                        )";
       /* $sql = "UPDATE mod_logactivofijotangible.dat_movregnumericoactivo
                SET depreciacionacumulada = (
                    SELECT rna.depreciacionacumulada
                    FROM mod_logactivofijotangible.dat_regnumericoactivo rna
                    WHERE rna.idregnumerico IN (
                        SELECT mrn1.idregnumerico
                        FROM mod_logactivofijotangible.dat_movregnumerico mrn1
                        INNER JOIN mod_logistica.dat_movimiento dms1 ON (dms1.idmovimiento = mrn1.idmovimiento)
                        WHERE (dms1.iddocumento = $idDocumento)
                        )
                    ),
                    depreciacionacumuladaalternativo = (
                        SELECT rna1.depreciacionacumulada
                        FROM mod_logactivofijotangible.dat_regnumericoactivo rna1
                        WHERE rna1.idregnumerico IN (
                            SELECT mrn2.idregnumerico
                            FROM mod_logactivofijotangible.dat_movregnumerico mrn2
                            INNER JOIN mod_logistica.dat_movimiento dms2 ON (dms2.idmovimiento = mrn2.idmovimiento)
                            WHERE (dms2.iddocumento = $idDocumento)
                            )
                        )
                WHERE (idmovregnumerico IN (
                        SELECT dmrn1.idmovregnumerico
                        FROM mod_logactivofijotangible.dat_movregnumerico dmrn1
                        INNER JOIN mod_logistica.dat_movimiento dm1 ON (dm1.idmovimiento = dmrn1.idmovimiento)
                        WHERE (dm1.iddocumento = $idDocumento)))
        ";*/

        $conn = Zend_Registry::get('conexion');       
        $conn->execute($sql);
    }

    /*
     * Este metodo dado un idregnumerico
     * devuelve el iddocumento si esta en un documento en elaboracion o preparado, en caso
     * de que no devuelve falso
     * */

    public function getIddocumentoRnActEnElaboracionOPreparado($idregnumerico)
    {

        $query = new Doctrine_Query();
        //new DatMovRegNumerico();
        $iddocumento = false;
        $datos = $query
            ->select('dd.iddocumento')
            ->from('DatDocumento dd')
            ->innerjoin('dd.DatMovimientos dm')
            ->innerJoin('dm.DatMovRegnumerico mrn')
            ->where('mrn.idregnumerico = ? and dd.estado IN (1,2)', array($idregnumerico))
            ->fetchArray();

        if (count($datos) > 0) {
            $iddocumento = $datos[0]['iddocumento'];
        }
        return $iddocumento;
    }

    public function getJoinRegNumericoPlugin($query, $origen = 'rna', $destinoPlug = 'rnap', $joinTablasexter = false)
    {
        $pluginCount = 1;
        $regnumact = new DatRegnumericoActivo();
        foreach ($this->listaPlugins as $pluginModel) {
            $pluginModel->initBaseRelation($regnumact);
            $pluginModel->addJoinModel($query, $origen, $destinoPlug.''.$pluginCount, $joinTablasexter);
            if (!$joinTablasexter) {
                $selectPlug = $pluginModel->getQuerySelectFields($destinoPlug.$pluginCount);
                $query->addSelect($selectPlug);
            }
            //$query->addSelect($destinoPlug.$pluginCount.".*");
            ++$pluginCount;
        }
        return $query;
    }

    public static function tratamientoFechaFmportar($fecha)
    {
        $fechaArray = preg_split("/[\/\-]+/", $fecha);
        if (count($fechaArray) == 3) {
            $fecha = "'" . $fechaArray[2] . '-' . $fechaArray[1] . '-' . $fechaArray[0] . "'";
        } else {
            if (count($fechaArray) == 2) {
                $fecha = "'" . $fechaArray[1] . '-' . $fechaArray[0] . '-01' . "'";
            } else {
                if (count($fechaArray) == 1) {
                    $fecha = "'" . $fechaArray[0] . '-01-01' . "'";
                } else {
                    return null;
                }
            }
        }
        return $fecha;
    }
    public function validarFechaImportar(&$datos)
    {
        foreach ($datos as &$data) {
            $data->fechaadq = ($data->fechaadq) ? self::tratamientoFechaFmportar($data->fechaadq) : null;
            $data->fechaexpini = ($data->fechaexpini) ? self::tratamientoFechaFmportar($data->fechaexpini) : null;
            $data->fechaexpfin = ($data->fechaexpfin) ? self::tratamientoFechaFmportar($data->fechaexpfin) : null;
            $data->fechainicialgarantia = ($data->fechainicialgarantia) ? self::tratamientoFechaFmportar(
                $data->fechainicialgarantia
            ) : null;
            $data->fechafingarantia = ($data->fechafingarantia) ? self::tratamientoFechaFmportar(
                $data->fechafingarantia
            ) : null;
        }
        return $datos;
    }

    /**
     * @param $idmedio Este idmedio es el idmedio de la tabla mod_estructura.dat_medio que coincide con un idfila
     */
    public function getRegistrosPorIdmediocompletamiento($parametros)
    {
        $idmedio = is_array($parametros) ? $parametros['idmedio'] : $parametros;
        $sqlSelect = "select
                    (i.denominacion || ' ' || coalesce(m.denominacion, '') || ' ' ||coalesce(mo.denominacion, '')) as tipounidadespecifica ,
					m.denominacion as marca,
					mo.denominacion as modelo,
                    i.denominacion as tipounidad,
                    rn.idregnumerico,
                    cat.denominacion as categoria,
                    rnat.idgps as identificadorgps,
                    et.denominacion as estadotecnico,
                    rnat.cantpersonasentado as personalsentado,
                    rnat.cantpersonapie as personaldepie,
                    rnat.normacombustible as normacombustible,
                    rnat.nromatricula as matricula,
                    rnat.indicativo as indicativo,
                    rnat.capacidad as capacidad";
        $sqlFrom = " from mod_logactivofijotangible.dat_registronumerico rn
                    inner join  mod_logactivofijotangible.dat_regnumericoactivo rna on rn.idregnumerico = rna.idregnumerico
                    left join mod_logactivofijotangible.dat_regnumericoactivotransp rnat on rna.idregnumerico = rnat.idregnumerico
                    inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto
                    inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
                    inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
                    
                    left join mod_datosmaestros.nom_marca m on ih.idmarca = m.idmarca
                    left join mod_datosmaestros.nom_modelo mo on ih.idmodelo = mo.idmodelo
                    
                    left join mod_logactivofijotangible.nom_categoriatransp cat on cat.idcategoriatransp = rnat.idcategoriatransp
                    inner join mod_logactivofijotangible.nom_estatustecnico et on et.idestatustecnico = rna.idestatustecnico ";

        $sqlWhere = " where i.parentpath OPERATOR(public.<@) (
                        select  i1.parentpath from mod_estructuracomp.dat_medio dm
                        inner join mod_datosmaestros.nom_indicador i1 on i1.idindicador = dm.idnommedio
                        where dm.idmedio = $idmedio
                    )
                    /*and
                    p.idestructura = (
                        select f.idpadre from mod_estructuracomp.nom_filaestruc f
                        inner join mod_estructuracomp.dat_medio dm1 on dm1.idmedio = f.idfila
                        where dm1.idmedio = $idmedio
                    )*/ ";
        $andWhere = array();
        /*$parametros = $andWhere;
        $parametros['indicativo'] = 106;*/
        if($parametros['matricula']){
           // $andWhere[] = "rnat.nromatricula ilike '{$parametros['matricula']}%'";
        }
        if($parametros['indicativo']){
            //$andWhere[] = "rnat.indicativo ILIKE '{$parametros['indicativo']}%'";
        }
        $andWhereStr = count($andWhere) == 0 ? '' : implode(' AND ', $andWhere);
        $sqlWhere.= count($andWhere) == 0 ? '' : ' and '.$andWhereStr;
        $sqlOrderBy = " order by i.parentpath";
        $sqlCount = 'SELECT count (rn.idregnumerico) ' . $sqlFrom . $sqlWhere;
        $conn = Zend_Registry::get('conexion');
		//die($sqlSelect . $sqlFrom . $sqlWhere . $sqlOrderBy);
        $datos = $conn->execute($sqlSelect . $sqlFrom . $sqlWhere . $sqlOrderBy)->fetchAll(PDO::FETCH_ASSOC);

        $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);
        $total = $total[0]['count'];
        return array('cantidad' => $total, 'datos' => $datos);
    }
    
    public function getRegistrosDisponibles($parametros)
    {

        
        /*$depreciacion = "";
        $operaciones = $this->_mComunAFT->getArrayIdOperacionesUtilizadas(false, false, 'OPER_DEPRECIACION', false);
        
        if (count($operaciones)) {
            $idOperacion = $operaciones[0];
            $depreciacion = " AND dd1.idoperacion <> $idOperacion";
        }*/

        $operacion = $this->_mComunAFT->getDatosInterfazByIdOperacion($parametros['idoperacion']);
        
        $excluirUH = true;
        if(strpos($operacion['codigo'], '_UH') !== false || strpos($operacion['codigo'], 'UTIL') !== false){
            $excluirUH = false;
        }
        
        $sqlSelect = "SELECT rna.idregnumerico, i.codigo, i.numeropieza, rna.denominacion, rna.nroinventario, rna.valorcontable, "
            ."rna.valorcontablealternativo,rna.depreciacionacumulada,rna.depreciacionacumuladaalternativo, nat.denominacion as naturaleza, "                
            ."(dperson.nombre || ' ' || COALESCE(dperson.snombre,'') || ' ' || dperson.papel || ' ' || dperson.sapel) as responsable ";
        
        $sqlFrom = "FROM mod_logactivofijotangible.dat_regnumericoactivo rna "
            ."INNER JOIN mod_logactivofijotangible.dat_registronumerico drn ON rna.idregnumerico = drn.idregnumerico " 
            ."INNER JOIN mod_logistica.dat_producto p	ON drn.idproducto = p.idproducto " 
            ."INNER JOIN mod_datosmaestros.nom_indicador i ON p.idindicador = i.idindicador "
            ."INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador "
            ."INNER JOIN mod_datosmaestros.nom_naturaleza nat	ON rna.idnaturaleza = nat.idnaturaleza "
            // ."INNER JOIN mod_logactivofijotangible.nom_estatustecnico nestado ON rna.idestatustecnico = nestado.idestatustecnico "
            ."LEFT JOIN mod_logactivofijotangible.dat_responsable dresp ON (dresp.idresponsable = rna.idresponsable) "
            ."LEFT JOIN mod_logactivofijotangible.nom_estatustecnico et ON rna.idestatustecnico = et.idestatustecnico "
            ."LEFT JOIN mod_persona.dat_persona dperson ON dresp.idpersona = dperson.idpersona "
            ."LEFT JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca "
            ."LEFT JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo "
            ."LEFT JOIN mod_logactivofijotangible.conf_identificadormedio confmedio ON i.idindicador = confmedio.idindicador ";
        
        $sqlWhere = "WHERE (rna.plantilla = 1 AND rna.idestadoperacion = 1 " 
                // Se quita la condicion porque no tiene sentido
                /*."AND rna.idregnumerico NOT IN (SELECT mrn1.idregnumerico "
                ."    FROM mod_logactivofijotangible.dat_movregnumerico mrn1 "
                ."    INNER JOIN mod_logistica.dat_movimiento m1	ON (m1.idmovimiento = mrn1.idmovimiento) "
                ."    INNER JOIN mod_logistica.dat_documento dd1 ON (dd1.iddocumento = m1.iddocumento) "
                ."    INNER JOIN mod_logactivofijotangible.dat_registronumerico rn1	ON (rn1.idregnumerico = mrn1.idregnumerico) "
                ."    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna1	ON (drn.idregnumerico = rna1.idregnumerico) "
                ."    WHERE (rna1.idestadoperacion <> 1 "
                ."    AND rna.idregnumerico = mrn1.idregnumerico "
                ."    $depreciacion )"
                .") "*/
                // Condicion: Que no existan activos en medio de procesos sin terminar (documentos en elaboracion o preparado)
                ."AND rna.idregnumerico NOT IN (SELECT mrn2.idregnumerico "
                ."    FROM mod_logactivofijotangible.dat_movregnumerico mrn2 "
                ."    INNER JOIN mod_logistica.dat_movimiento m2 ON (m2.idmovimiento = mrn2.idmovimiento) "
                ."    INNER JOIN mod_logistica.dat_documento dd2 ON (dd2.iddocumento = m2.iddocumento) "
                ."    WHERE (dd2.estado in (1, 2)) "
                .") "
                ."AND rna.esbaja = 0 "
                ."AND rna.estaentidad = 1 "
                ."AND rna.idarearesp = {$parametros['idestructuraop']} "
                .") ";
             
         
        $sqlOrderBy = "ORDER BY rna.idregnumerico DESC ";
        
        $paginado="";
        if($parametros['limit'])
            $paginado=" LIMIT {$parametros['limit']} ";
        if($parametros['start'])
            $paginado.=" OFFSET {$parametros['start']} ";
            
        if($parametros['codigo'])
            $sqlWhere.=" AND i.codigo ILIKE '%{$parametros['codigo']}%' ";
        if($parametros['numeropieza'])
            $sqlWhere.=" AND i.numeropieza ILIKE '%{$parametros['numeropieza']}%' ";
        if($parametros['denominacion'])
            $sqlWhere.=" AND rna.denominacion ILIKE '%{$parametros['denominacion']}%' ";
        if($parametros['nroinventario'])
            $sqlWhere.=" AND rna.nroinventario ILIKE '%{$parametros['nroinventario']}%' ";
        
        if(is_numeric($parametros['responsable'])){
            $idresponsable = $parametros['responsable'];
            unset($parametros['responsable']);
            $sqlWhere.= " AND rna.idresponsable = {$idresponsable} ";
        }
        
        if($parametros['comparaciones']){
            foreach($parametros['comparaciones'] as &$comparacion){
                $comparacion['campo'] = 'rna.'.$comparacion['campo'];
                $sqlWhere.=" AND {$comparacion['campo']} {$comparacion['signo']} {$comparacion['valor']} ";
            }
        }
        
        if($parametros['criterio']){
            $sqlWhere.=" AND (i.codigo ILIKE '%{$parametros['criterio']}%' OR ";
            $sqlWhere.=" i.numeropieza ILIKE '%{$parametros['criterio']}%' OR ";
            $sqlWhere.=" rna.denominacion ILIKE '%{$parametros['criterio']}%' OR ";
            $sqlWhere.=" rna.nroinventario ILIKE '%{$parametros['criterio']}%') ";
        }
        if($parametros['naturaleza'])
            $sqlWhere.=" AND rna.idnaturaleza = {$parametros['naturaleza']} ";
        if($parametros['idnaturaleza'])
            $sqlWhere.=" AND rna.idnaturaleza = {$parametros['idnaturaleza']} ";
        
        if($excluirUH){
            $sqlWhere.=" AND ih.isuh <> 1 ";
        } else {
            $sqlWhere.=" AND ih.isuh = 1 ";
        }
        /*if(count($parametros['idnaturalezaexcluir']) > 0){
            $idnatexcluir = implode(',', $parametros['idnaturalezaexcluir']);
            $sqlWhere.=" AND i.idnaturaleza not in ($idnatexcluir) ";
        }*/
        
        $conn = Zend_Registry::get('conexion');        
        $sqlDatos = $sqlSelect . $sqlFrom . $sqlWhere . $sqlOrderBy . $paginado;  

        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
        $sqlCount = 'SELECT count (rna.idregnumerico) ' . $sqlFrom . $sqlWhere;
        $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);
        $total = $total[0]['count'];
        return array('cantidad' => $total, 'datos' => $datos);
        
    }

    /*
     *
     */
    public function getActivosInventarioYaExistentes($iddocumento, $idestructura = false){

        $doc = Doctrine::getTable('DatDocumento')->find($iddocumento);
        $oper = ComunAFTModel::getInstance()->getOperacionSobreMediosById($doc->idoperacion);
        if(strpos($oper->codigooperacion, '_UH') > 0 || strpos($oper->codigooperacion, 'UTILES') > 0){
            return [];
        }

        $estructura = 'Estructura';
        if (!$idestructura) {
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructura = $global->$estructura->idestructura;
        }

        $sql_datos = "select mrn.idregnumerico, mrna.nroinventario
                        from mod_logactivofijotangible.dat_movregnumerico mrn
                        inner join mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico
                        inner join mod_logistica.dat_movimiento m on m.idmovimiento = mrn.idmovimiento
                        where m.iddocumento = $iddocumento";

        $conn = Zend_Registry::get('conexion');
        $data = $conn->fetchAll($sql_datos);

        $invs = [];
        $idrns = [];
        foreach ($data as $mrn){
            array_push($invs, "'".$mrn['nroinventario']."'");
            array_push($idrns, $mrn['idregnumerico']);
        }

        $inventarios = implode(",", $invs);
        $idregistros = implode(",", $idrns);

        $sql = "select rna.nroinventario
                from mod_logactivofijotangible.dat_registronumerico rn
                inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rn.idregnumerico = rna.idregnumerico
                inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto
                inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
                inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
                where p.idestructuracomun = $idestructura
                    and rna.nroinventario in ({$inventarios}) 
                    and rna.idregnumerico not in ({$idregistros})
                    and ih.isuh <> 1
                    ";

        $datos = $conn->fetchAll($sql);

        $repetidos = [];
        foreach ($datos as $dat){
            array_push($repetidos, $dat['nroinventario']);
        }
        return $repetidos;
    }

    public function getMediosTransportes($params){
        
        $sql_select = "
            select
                rn.idregnumerico, 
                i.denominacion, 
                rna.nroinventario,
                rnat.nromatricula,
                rnat.indicativo,
                (cc.concat || ' - ' || cc.descripcioncentrogrupo) as centrocosto,
                COALESCE(e.denominacion, eop.denominacion) as entidad,
                cc.idcentrogrupo as idcentrocosto,
                p.idestructuracomun as idestructuracomun,
                i.idindicador as idindicador
            ";
        $sql_from = "
            from mod_logactivofijotangible.dat_registronumerico rn
            inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            inner join mod_logactivofijotangible.dat_regnumericoactivotransp rnat on rna.idregnumerico = rnat.idregnumerico
            inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto
            inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
            inner join mod_contabilidadcosto.nom_centrocosto cc on cc.idcentrogrupo = rna.idcentrocosto
            
            inner join mod_estructuracomp.nom_filaestruc f on f.idfila = p.idestructuracomun
            left join mod_estructuracomp.dat_estructura e on e.idestructura = f.idfila and e.idproyecto = 0
            left join mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = f.idfila and eop.idproyecto = 0
        ";
        $sql_where = "
            WHERE rna.idestadoperacion NOT IN (0,7)
        ";

        if(!$params['idestructura']){
            $params['idestructura'] = $this->global->Estructura->idestructura;
        }
        $sql_where .= " and p.idestructuracomun = {$params['idestructura']} ";
        if($params['idcentrocosto']){
            $sql_where = " and rna.idcentrocosto = {$params['idcentrocosto']} ";
        }
        if($params['denominacion']){
            $sql_where = " and i.denominacion ILIKE '%{$params['denominacion']}%'";
        }
        if($params['indicativo']){
            $sql_where = " and rnat.indicativo ILIKE '%{$params['indicativo']}%'";
        }
        if($params['nromatricula']){
            $sql_where = " and rnat.nromatricula ILIKE '%{$params['nromatricula']}%'";
        }
        
        $sql_range = "";
        if(!$params['limit']){
            $params['limit'] = 30;
        }
        $sql_range = " LIMIT {$params['limit']} ";
        if(!$params['start']){
            $params['start'] = 0;
        }

        $sql_range .= " OFFSET {$params['start']} ";
        
        $sql_count = " SELECT count(rn.idregnumerico) as total" . $sql_from . $sql_where;
        $sql = $sql_select . $sql_from . $sql_where . $sql_range;
        
        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);
        $cantidad = $conn->fetchAll($sql_count);

        return array(
            'datos' => $datos,
            'total' => $cantidad[0]['total']
        );
    }
}
