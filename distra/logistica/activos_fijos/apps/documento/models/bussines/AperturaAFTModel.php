<?php

/**
 *
 */
class AperturaAFTModel extends BaseModel
{
    protected $_sConfGeneral, $_comunAFT, $servicioEyC;


    /**
     *
     */
    public function __construct()
    {
        parent::__construct();
        $this->_comunAFT = ComunAFTModel::getInstance();
        $this->servicioEyC = ServiciosEstructuraComposicionHelper::__init();
    }

    public function adicionarDocumento($parametros){
        if($parametros['mediosadicionados']){
            $parametros['mediosadicionados'] = Zend_Json::decode($parametros['mediosadicionados']);
        }
        if($parametros['medioseliminado']){
            $parametros['medioseliminado'] = Zend_Json::decode($parametros['medioseliminado']);
        }
        $apertura = new DatApertura();

        if(!$parametros['iddocapertura']){
            $parametros['estadoreceptor'] = 1;
            $parametros['estadoemisor'] = 1;
            $parametros['cantidadmedios'] = count($parametros['mediosadicionados']);
            $parametros['nroapertura'] = $this->devolverUltimoNumeroApertura()+1;
            $parametros['estructuraorigen'] = $this->global->Estructura->idestructura;
        }
        else {
            $apertura->assignIdentifier($parametros['iddocapertura']);
        }
        $apertura->synchronizeWithArray($parametros);
        $apertura->save();
        $parametros['iddocapertura'] = $apertura->iddocapertura;
        $this->eliminarMedio($parametros);
        $this->adicionarMedio($parametros);
        return $apertura;
    }
    public function eliminarApertura($idsApertura)
    {
        if(is_array($idsApertura)) {
            $ok = true;
            foreach($idsApertura as $idAp){
                $estados = $this->getEstadoActual($idAp);
                if($estados['estadoemisor']!=1 || $estados['estadoreceptor']!=1) {
                    $ok = false;
                    break;
                }
            }
            if($ok) {
                //Para cambviar el estado de los reg numericos para que se pueda seguir trabajando con ellos
                {
                    $idsreg = Doctrine_Query::create()->select('idregnumerico')
                        ->from('DatAperturaRegNum')->whereIn('iddocapertura ', $idsApertura)->fetchArray();
                    $arrRegNum = array();
                    foreach ($idsreg as $idReg) {
                        $arrRegNum[] = $idReg['idregnumerico'];
                    }
                    if (count($arrRegNum) > 0) {
                        Doctrine_Query::create()->update('DatRegnumericoActivo')->set('idestadoperacion=?', 0)
                            ->whereIn('idregnumerico ', $arrRegNum)->execute();
                    }
                }
                Doctrine_Query::create()->delete('DatAperturaRegNum')
                    ->whereIn('iddocapertura ', $idsApertura)->execute();
                Doctrine_Query::create()->delete('DatApertura')
                    ->whereIn('iddocapertura ', $idsApertura)->execute();
            } else throw new Exception("La apertura no se puede eliminar.");
        }
    }
    public function confirmarApertura($params)
    {
        $colum = ($params['tipo'] == 0)?'estadoemisor':'estadoreceptor';
        if($params['id']) {
            $estados = $this->getEstadoActual($params['id']);
            if(
                ($estados['estadoemisor'] == 1 && $params['tipo'] == 0)
                || ($estados['estadoreceptor']==1 && $params['tipo'] == 1)
            ) {
                Doctrine_Query::create()->update('DatApertura da')
                    ->set("da.{$colum}", EstadoDocumentoModel::ESTADO_PENDIENTE)
                    ->where("da.iddocapertura = ?", array($params['id']))
                    ->execute();
            }
            else throw new Exception("La apertura no se puede confirmar.");
        }
    }
    public function anularEstadoApertura($params)
    {
        $colum = ($params['tipo'] == 0)?'estadoemisor':'estadoreceptor';
        if($params['id']) {
            $estados = $this->getEstadoActual($params['id']);
            if(
                ($estados['estadoemisor'] == 2 && $params['tipo'] == 0 && $estados['estadoreceptor'] ==1 )
                || ($estados['estadoreceptor']==2 && $params['tipo'] == 1 && $estados['estadoemisor'] !=3)
            ) {
                Doctrine_Query::create()->update('DatApertura da')
                    ->set("da.{$colum}", EstadoDocumentoModel::ESTADO_ELABORACION)
                    ->where("da.iddocapertura = ?", array($params['id']))
                    ->execute();
            }
            else throw new Exception("La apertura no se puede anular.");
        }
    }
    public function aprobarApertura($params)
    {
        //$colum = ($params['tipo'] == 0)?'estadoemisor':'estadoreceptor';
        if($params['id']) {
            $estados = $this->getEstadoActual($params['id']);
            if($estados['estadoemisor'] == 2 && $params['tipo'] == 0 && $estados['estadoreceptor'] ==2 ) {
                $rep = $this->crearDocumentos($params['id']);
                if($rep['msg']){
                    return $rep;
                }
                Doctrine_Query::create()->update('DatApertura da')
                    //->set("da.{$colum}", EstadoDocumentoModel::ESTADO_APROBADO)
                    ->set("da.estadoemisor", EstadoDocumentoModel::ESTADO_APROBADO)
                    ->set("da.estadoreceptor", EstadoDocumentoModel::ESTADO_APROBADO)
                    ->where("da.iddocapertura = ?", array($params['id']))
                    ->execute();
            }
            else throw new Exception("La apertura no se puede aprobar.");
        }
        return true;
    }
    public function crearDocumentos($idapertura)
    {
        // Inicializando
        new DatAperturaRegNum();
        new DatRegnumerico();
        new DatDocTransferenciaEntidades();
        $producto = new LogisticaProductoModel();
        $regNumActService = new RegNumActivoService();
        $docActivoModel = new DocumentoActivoModel();
        $movService = new MovimientoService();
        $docLogModel = new DocumentoLogisticaModel(array('alias' => 'MMAFT', 'noexception' => true,
                                                         'subsistema' => LogisticaGlobal::SUBSISTEMA_AFT));
        $idEstructura = $this->global->Estructura->idestructura;

        // Buscando entidad destino
        $objApert = Doctrine::getTable('DatApertura')->find($idapertura);
        $iddestino = $objApert->destino;

        // Buscando el idoperacion de la apertura
        $codigo = 'OPER_APERTURA';
        $operApertura = $this->_comunAFT->getDatosInterfazOperacion(false, false, $codigo, false, $idEstructura);
        if(count($operApertura) == 0){
            return array('msg'=>"Debe configurar el documento de apertura");
        }


        // Buscando el idoperacion del traslado
        $codigo = 'OPER_TRASLADO_EXTER';
        $operTraslado = $this->_comunAFT->getDatosInterfazOperacion(false, false, $codigo, false, $idEstructura);
        if(count($operTraslado) == 0){
            return array('msg'=>"Debe configurar la operaci&oacute;n de traslado externo");
        }

        // Buscando el idoperacion de la recepcion del traslado de la apertura
        $codigo = 'OPER_REC_APER';
        $operRecTraslado = $this->_comunAFT->getDatosInterfazOperacion(false, false, $codigo, false, $iddestino);
        if(count($operRecTraslado) == 0){
            return array('msg'=>"Debe configurar la operaci&oacute;n de entrada en la entidad destino.");
        }
        // Buscando los datos
        $sqlActivo = new Doctrine_Query();
        $sqlActivo->select("rn.*")
            ->from("DatRegnumerico rn")
            ->innerJoin("rn.DatRegnumericoActivo rna")
            ->innerJoin("rn.DatAperturaRegNum dar");

        $select = $regNumActService->getSelectFilesDatRegNumActivo('rna', false);
        $sqlActivo->addSelect($select);

        $sqlActivo = $regNumActService->getJoinRegNumericoPlugin($sqlActivo, 'rna', 'rnap', false);

        $sqlActivo->innerJoin("rn.DatProductoLogistica dp");
        $sqlActivo->addSelect("dp.idproducto as idproducto, dp.idindicador as idprod,
            dar.idarearesp as idarearespdestino");
        $sqlActivo->where("dar.iddocapertura = ?", array($idapertura));

        $rnMov = $sqlActivo->orderBy("dp.idindicador")->fetchArray();

        /******************************* CREANDO EL DOCUMENTO DE APERTURA ******************************************/
        // Creando el documento de apertura
        $paramApertura = array(
            'iddoc' => $operApertura[0]['iddoc'],
            'idoperacion' => $operApertura[0]['idnomoperaciones'],
            'idestructuracomun' => $idEstructura,
            'observaciones' => 'Apertura de la especialidad'
        );

        $doc = $docActivoModel->addActivoDoc($paramApertura);
        $doc->estado = 2;
        $doc->nrodoc = $doc->numeroref;

        // Le agrego los movimientos
        $doc = $movService->crearMovimiento($rnMov, $doc);
        // Salvo el documento
        $doc->save();

        // Apruebo el documento
        $crono = $docLogModel->aprobarDocumento($doc->iddocumento, true);
        $producto->getMovimientoModel()->aprobarCronologiaProductos($doc->iddocumento, $crono);


        /******************************* CREANDO EL DOCUMENTO DE TRASLADO ******************************************/
        // Creando el documento de traslado
        $paramTraslado = array(
            'iddoc' => $operTraslado[0]['iddoc'],
            'idoperacion' => $operTraslado[0]['idnomoperaciones'],
            'idestructuracomun' => $idEstructura,
            'observaciones' => 'Traslado de la apertura de la especialidad'
        );

        $docTrasl = $docActivoModel->addActivoDoc($paramTraslado);
        $docTrasl->estado = 2;
        $docTrasl->nrodoc = $docTrasl->numeroref;


        $docTrasl->DatDocTransferenciaEntidades->identidaddestino = $iddestino;

        // Le agrego los movimientos
        $docTrasl = $movService->crearMovimiento($rnMov, $docTrasl);

        // Salvo el documento
        $docTrasl->save();

        // Apruebo el documento
        $cronoTrasl = $docLogModel->aprobarDocumento($docTrasl->iddocumento, true);
        $producto->getMovimientoModel()->aprobarCronologiaProductos($docTrasl->iddocumento, $cronoTrasl);

        /******************************* CREANDO LOS DOCUMENTOS DE RRECEPCION DE TRASLADO ****************************/

        $paramRecTraslado = array(
            'iddoc' => $operRecTraslado[0]['iddoc'],
            'idoperacion' => $operRecTraslado[0]['idnomoperaciones'],
            'idestructuracomun' => $iddestino,
            'observaciones' => 'Recepcion de traslado de apertura de la especialidad'
        );

        $docRecTrasl = $docActivoModel->addActivoDoc($paramRecTraslado);
        $docRecTrasl->estado = 2;
        $docRecTrasl->nrodoc = $docRecTrasl->numeroref;
        $docRecTrasl->DatDocumentoPadre[0]->idpadre = $docTrasl->iddocumento;

        
        //$rnCollection = new Doctrine_Collection('DatRegnumericoActivo');
        
        $rnCollection = new Doctrine_Collection('DatRegnumerico');
        
        foreach($rnMov as &$rn){
            $rn['idarearesp'] = $rn['idarearespdestino'];
            
            $objRn = new DatRegnumerico();
            $objRn->assignIdentifier($rn['idregnumerico']);
            $objRn->DatRegnumericoActivo->idestadoperacion = 1;
            $objRn->DatRegnumericoActivo->idarearesp = $rn['idarearespdestino'];
            $objRn->DatRegnumericoActivo->idubicacion = null;
            $objRn->DatRegnumericoActivo->idresponsable = null;
            $objRn->DatRegnumericoActivo->idestadoperacion = 1;
            $rnCollection->add($objRn);
            /*
            $objRna = new DatRegnumericoActivo();
            $objRna->assignIdentifier($rn['idregnumerico']);
            $objRna->idestadoperacion = 1;
            $objRna->idarearesp = $rn['idarearespdestino'];
            $objRna->idubicacion = null;
            $objRna->idresponsable = null;
            $objRna->idestadoperacion = 1;
            $rnCollection->add($objRna);*/
        }  
        
        
        // Le agrego los movimientos
        $docRecTrasl = $movService->crearMovimiento($rnMov, $docRecTrasl);
        // Salvo el documento        
        $docRecTrasl->save();

        // Apruebo el documento
        $cronoRecTrasl = $docLogModel->aprobarDocumento($docRecTrasl->iddocumento, true);
        $producto->getMovimientoModel()->aprobarCronologiaProductos($docRecTrasl->iddocumento, $cronoRecTrasl);

        /*$rnCollection = new Doctrine_Collection('DatRegnumericoActivo');
        foreach($rnMov as $rn){
            $objRna = new DatRegnumericoActivo();
            $objRna->assignIdentifier($rn['idregnumerico']);
            $objRna->idestadoperacion = 1;
            $objRna->idarearesp = $rn['idarearespdestino'];
            $objRna->idubicacion = null;
            $objRna->idresponsable = null;
            $objRna->idestadoperacion = 1;

            $rnCollection->add($objRna);
        }        */
             
        $rnCollection->save(); 
        // Para generar los numeros de serie si es necesario
        $docActivoModel->auxAprobarDocOper($operRecTraslado, $iddestino, $docRecTrasl->iddocumento);
        
        
        foreach ($rnCollection as $rn){
            $rn->DatProductoLogistica;
            $rn->DatProductoLogistica->cantidad++;
            $rn->DatProductoLogistica->disponible++;
        }
        $rnCollection->save();
        
        return true;
    }
    public function cargarAperturas($parametros)
    {
        $query = new Doctrine_Query();
        $subQueryCantMedios = " ( SELECT count(dar.idregnumerico) FROM DatAperturaRegNum dar
        WHERE dar.iddocapertura = da.iddocapertura) as cantmedios
         ";
        $subQuerySinUbicar = " ( SELECT count(dar1.idaperturaregnum) FROM DatAperturaRegNum dar1
        WHERE dar1.iddocapertura = da.iddocapertura and dar1.idarearesp is null) as sinubicar
         ";
        $query->select(
            "da.iddocapertura, da.destino, da.estadoemisor, da.estadoreceptor, da.nroapertura,
            da.estructuraorigen, da.descripcion, $subQueryCantMedios, $subQuerySinUbicar"
        )
            ->from('DatApertura da')
        ->orderBy("da.nroapertura DESC");
        if($parametros['tipo']== 0){
            $query->addWhere("da.estructuraorigen = ?", array($this->global->Estructura->idestructura));
        }
        else if($parametros['tipo']== 1){
            $query->addWhere("da.destino = ?", array($this->global->Estructura->idestructura))
            ->addWhere("da.estadoemisor <> 1");
        }
        if($parametros['criterio'] && is_numeric($parametros['criterio'])){
            $query->addWhere("da.nroapertura = ?", array($parametros['criterio']));
        }
        $datos = $query->fetchArray();
        $this->auxPonerDenomEstructura($datos);
        return array('datos'=>$datos, 'cantidad'=>$query->count());
    }

    public function adicionarMedio($params)
    {
        if($params['mediosadicionados']) {
            $mediosAddArray = new Doctrine_Collection('DatAperturaRegNum');
            $regNumAddArray = new Doctrine_Collection('DatRegnumericoActivo');
            foreach ($params['mediosadicionados'] as $med) {
                $med['iddocapertura'] = $params['iddocapertura'];
                $med['idarearesp'] = ($med['idarea'])?$med['idarea']:null;
                unset($params['idarea']);
                //cambiando estado del registro numérico para que no salga disponible para otras operaciones
                $regNum = new DatRegnumericoActivo();
                $regNum->assignIdentifier( $med['idregnumerico']);
                $regNum->idestadoperacion = 9;
                $regNumAddArray[] = $regNum;
                //guardando el registro de la apertura
                $objMed = new DatAperturaRegNum();
                if($med['idaperturaregnum']){
                    $objMed->assignIdentifier($med['idaperturaregnum']);
                }
                if (is_array($med)) {
                    $objMed->synchronizeWithArray($med);
                }
                $mediosAddArray[] = $objMed;
            }
            if ($regNumAddArray->count()) {
                $regNumAddArray->save();
            }
            if ($mediosAddArray->count()) {
                $mediosAddArray->save();
            }
        }

    }
    public function eliminarMedio($params)
    {
        if($params['medioseliminado'] && is_array($params['medioseliminado'])) {
            Doctrine_Query::create()->update('DatRegnumericoActivo')->set('idestadoperacion', 0)
                ->whereIn('idregnumerico ', Zend_Json::decode($params['medioseliminadosrn']))->execute();
            Doctrine_Query::create()->delete('DatAperturaRegNum')
                ->whereIn('idaperturaregnum ', $params['medioseliminado'])->execute();
        }
    }
    public function cargarMediosDoc($parametros)
    {
        $query = new Doctrine_Query();
        $query->select(
            " dar.idaperturaregnum, dar.iddocapertura, dar.idregnumerico, dar.idarearesp as idarea"
        )
            ->from('DatAperturaRegNum dar');
        $query->addWhere("dar.iddocapertura = ?", array($parametros['iddocapertura']));
        $result = $query->fetchArray();
        $regOpServices = new RegistroOperativoService();
        foreach($result as $index => $medio){
            $medio['excluirProceso']=true;
            $temp = $regOpServices->cargarRegistroOperativos($medio);
            if((count($temp['datos'])>0)) {
                $obj = $temp['datos'][0];
                $obj['idaperturaregnum'] = $medio['idaperturaregnum'];
                $obj['idarea'] = $medio['idarea'];
                $obj['denomarearesp'] = $medio['denomarearesp'];
                $result[$index]= $obj;
            }
            $result[$index]['denomarearesp']
                // = $this->estructuraHelper->getEstructura($medio['idarea'])[0]->denominacion;
                = $this->integrator->metadatos->DameEstructura($medio['idarea'])[0]->denominacion;
            unset($result[$index]['text']);
        }
        return array('datos'=>$result, 'cantidad'=>$query->count());
    }
    public function cargarMediosExistentes($parametros)
    {
        $idsExcluir =  $this->mediosEnApertEnProceso();
        if($parametros['excluir']){
            $parametros['excluir'] = Zend_Json::decode($parametros['excluir']);
            $idsExcluir = array_merge($idsExcluir,$parametros['excluir']);
        }
        $parametros['idsRegNumNoMostrar'] = $idsExcluir;
        $regOpServices = new RegistroOperativoService();
        $parametros['idestadoperacion'] = 0;
        //$estructura = $this->servicioEyC->getEstructura($this->global->Estructura->idestructura)[0];
        $estructura = $this->integrator->metadatos->DameEstructura($this->global->Estructura->idestructura)[0];
        $parametros['idespecialidad'] = $estructura->idespecialidad;
        return $regOpServices->cargarRegistroOperativos($parametros);
    }
    public function mediosEnApertEnProceso(){
        $query = new Doctrine_Query();
        $result = $query->select(
            "da.iddocapertura, dar.idregnumerico as idregnumerico"
        )
            ->from('DatApertura da')
            ->innerJoin("da.DatAperturaRegNum dar")
            ->where("da.estadoreceptor <> 3 and da.estadoemisor <> 3")
            ->fetchArray();
        $arry = array();
        foreach($result as $med){
            $arry[] = $med['idregnumerico'];
        }
        return $arry;
    }
    public function cargarEstructuras($parametros)
    {
        return $this->_comunAFT->cargarEstructuras($parametros);
    }
    public function cargarEstructurasHijas(){
        return $this->_comunAFT->getEstructurasHijas($this->global->Estructura->idestructura ,true);
    }
    public function addResultLimits($array = array(), $params = array('start'=>0, 'limit'=>15))
    {
        $result = array();
        $valores = array();
        $limitOld = 0;
        $limitOld += $params['start'] + $params['limit'];
        for($i = $params['start']; $i < $limitOld; $i++) {
            if (count($array) == $i) {
                break;
            }
            if($array[$i]['idfila'] != $this->global->Estructura->idestructura) {
                array_push($valores, $array[$i]);
            }
        }
        $result['datos'] = ($valores);
        $result['cantidad'] = count($array);
        return $result;

    }
    public function devolverUltimoNumeroApertura(){
        $query = new Doctrine_Query();
        $query->select("MAX(d.nroapertura) as numero")->from('DatApertura d');
        $res = $query->fetchArray();
        return $res[0]['numero'] ? $res[0]['numero'] : 0;
    }
    public function getEstadoActual($id)
    {
        $apertura = Doctrine::getTable('DatApertura')->find($id);
        return array('estadoemisor'=>$apertura->estadoemisor, 'estadoreceptor'=>$apertura->estadoreceptor);
    }
    private function auxPonerDenomEstructura(&$array)
    {
        foreach($array as $index =>$dato){
            //$destino = $this->estructuraHelper->getEstructura($dato['destino'])[0]->denominacion;
            $destino = $this->integrator->metadatos->DameEstructura($dato['destino'])[0]->denominacion;
            //$estructuraorigen = $this->estructuraHelper->getEstructura($dato['estructuraorigen'])[0]->denominacion;
            $estructuraorigen = $this->integrator->metadatos->DameEstructura($dato['estructuraorigen'])[0]->denominacion;
            $array[$index]['denomdestino'] = $destino;
            $array[$index]['denomestructuraorigen'] = $estructuraorigen;
        }
    }
}
