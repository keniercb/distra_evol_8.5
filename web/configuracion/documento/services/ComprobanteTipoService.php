<?php 
class ComprobanteTipoService extends ZendExt_Model
{    
    public function ComprobanteTipoService(){
		parent::ZendExt_Model();
	}
    public function TipoDocumentos()
	{
		$tipodoc = DatDocumentoprim::TipoDocumentos();
		if(!$tipodoc)return array();
		
		foreach($tipodoc as $i=>$doc)
		{
			$tipodoc[$i]['denominacion'] = $doc['NomDocprim']['denominacion'];
			unset($tipodoc[$i]['NomDocprim']);
		}
		$standard = new ZendExt_ClassStandard();
		return $standard->ArrayObject($tipodoc);	  
	}
	
	public function TipoDocumentosByAlias($alias,$subsistema = 0)
	{   
	    $xml = ZendExt_FastResponse::getXML("documentos");
		$aliasx = $xml->$alias;
		$aliasx = utf8_encode($aliasx['alias']);
		if($subsistema == 0)
		{
			$subsistema = $this->global->Subsistema->idsubsistema;
		}
		$idestructurasubsist = $this->integrator->parametros->EncuentraIdestructurasubsist($subsistema);
		
		$doc = DatDocumentoprim::BuscarPorAlias($aliasx,$idestructurasubsist);
		if ($doc[0]['iddoc'])
		{
			$doc[0]['denominacion'] = $doc[0]['NomDocprim']['denominacion'];
			$doc[0]['abreviatura'] = $doc[0]['NomDocprim']['abreviatura'];
			$doc[0]['concepto'] = $doc[0]['NomDocprim']['concepto'];
			$doc[0]['codigo'] = $doc[0]['NomDocprim']['codigo'];
			unset($doc[0]['NomDocprim']);
		}
		if(!$doc)return new stdClass();
		return ZendExt_ClassStandard::Object($doc);
	}
	
	public function TipoDocumentoByAliasByIdestructutra($alias,$idestructura,$subsistema = 0)
	{   
	    $xml = ZendExt_FastResponse::getXML("documentos");
		$aliasx = $xml->$alias;
		$aliasx = utf8_encode($aliasx['alias']);
		if($subsistema == 0)
		{
			$subsistema = $this->global->Subsistema->idsubsistema;
		}
		$idestructurasubsist = $this->integrator->parametros->EncuentraIdestructurasubsistByIdestructura($subsistema,$idestructura);
		$doc = DatDocumentoprim::BuscarPorAlias($aliasx,$idestructurasubsist);
		if ($doc[0]['iddoc'])
		{
			$doc[0]['denominacion'] = $doc[0]['NomDocprim']['denominacion'];
			$doc[0]['abreviatura'] = $doc[0]['NomDocprim']['abreviatura'];
			$doc[0]['concepto'] = $doc[0]['NomDocprim']['concepto'];
			$doc[0]['codigo'] = $doc[0]['NomDocprim']['codigo'];
			unset($doc[0]['NomDocprim']);
		}
		if(!$doc)return new stdClass();
		return ZendExt_ClassStandard::Object($doc);
	}
	
	public function TipoDocumentosPorCategoria($aliascat,$entidad=0,$subsistema = 0)
	{
	    if($subsistema == 0)
		{
			$subsistema = $this->global->Subsistema->idsubsistema;
		}
		$idestructurasubsist = $this->integrator->parametros->EncuentraIdestructurasubsist($subsistema,$entidad);
		
		$xml = ZendExt_FastResponse::getXML("categoriadoc");
		$aliasdoc = $xml->$aliascat;
		$cadal = array();$i = 0;
		if($aliasdoc)
		{		
		   foreach($aliasdoc->children() as $doc)
			  $cadal[] = (string)$doc['alias']; 
		}
		$doc = DatDocumentoprim::BuscarCategoriaPorAlias($cadal,$idestructurasubsist);
		
		foreach($doc as $i=>$docc)
	    {
			$doc[$i]['denominacion'] = $docc['NomDocprim']['denominacion'];
			$doc[$i]['abreviatura'] = $docc['NomDocprim']['abreviatura'];
			$doc[$i]['concepto'] = $docc['NomDocprim']['concepto'];
			$doc[$i]['codigo'] = $docc['NomDocprim']['codigo'];
			unset($doc[$i]['NomDocprim']);
			//print_r($docc);
	    }
		//print_r($doc);die;
		if(!$doc)return array();
		$classstandard = new ZendExt_ClassStandard();
		$result = $classstandard->ArrayObject($doc);
		return $result;
	}
	
	public function TipoDocumentoPorCategoriaByIdestructutra($aliascat,$entidad=0,$subsistema = 0)
	{
	    if($subsistema == 0)
		{
			$subsistema = $this->global->Subsistema->idsubsistema;
		}
		$idestructurasubsist = $this->integrator->parametros->EncuentraIdestructurasubsistByIdestructura($subsistema,$entidad);
		$xml = ZendExt_FastResponse::getXML("categoriadoc");
		$aliasdoc = $xml->$aliascat;
		$cadal = array();$i = 0;
		if($aliasdoc)
		{		
		   foreach($aliasdoc->children() as $doc)
			  $cadal[] = (string)$doc['alias']; 
		}
		$doc = DatDocumentoprim::BuscarCategoriaPorAlias($cadal,$idestructurasubsist);
		
		foreach($doc as $i=>$docc)
	    {
			$doc[$i]['denominacion'] = $docc['NomDocprim']['denominacion'];
			$doc[$i]['abreviatura'] = $docc['NomDocprim']['abreviatura'];
			$doc[$i]['concepto'] = $docc['NomDocprim']['concepto'];
			$doc[$i]['codigo'] = $docc['NomDocprim']['codigo'];
			unset($doc[$i]['NomDocprim']);
			//print_r($docc);
	    }
		//print_r($doc);die;
		if(!$doc)return array();
		$classstandard = new ZendExt_ClassStandard();
		$result = $classstandard->ArrayObject($doc);
		return $result;
	}
	
	public function TipoDocumentosById($iddocumento)
	{	    	
		$doc = DatDocumentoprim::BuscarPorId($iddocumento);
		if ($doc[0]['iddoc'])
		{
			$doc[0]['denominacion'] = $doc[0]['NomDocprim']['denominacion'];
			$doc[0]['abreviatura'] = $doc[0]['NomDocprim']['abreviatura'];
			$doc[0]['concepto'] = $doc[0]['NomDocprim']['concepto'];
			$doc[0]['codigo'] = $doc[0]['NomDocprim']['codigo'];
			unset($doc[0]['NomDocprim']);
		}
		if(!$doc)return new stdClass();
		return ZendExt_ClassStandard::Object($doc);
	}
	
	public function TipoOperacDoc($iddocumento)
	{	    			
		$operaciones = DatOperacionCont::TipoOperacDoc($iddocumento);
		foreach($operaciones as $i => $op)
		{
			$operaciones[$i]['denominacion'] = $op['NomOperacione']['denominacion'];
			$operaciones[$i]['idoperacion'] = $op['idoperacion'];
		}
		$standard = new ZendExt_ClassStandard();
	    return $standard->ArrayObject($operaciones);
	}

    public function TipoOperaciones()
	{
	   $tipooper = DatOperacionCont::TipoOperaciones();
	   if(!$tipooper)return array();	   
	   foreach($tipooper as $i=>$top)
	   {
	      $tipooper[$i]['denominacion'] = $top['NomOperacione']['denominacion'];
		  unset($tipooper[$i]['NomOperacione']);
		  $tipooper[$i]['idconcepto'] = $top['NomConceptooperacion']['idconceptooperacion'];
		  $tipooper[$i]['concepto'] = $top['NomConceptooperacion']['denominacionconcepto'];
		  $tipooper[$i]['signo'] = $top['NomConceptooperacion']['signoconcepto'];
		  unset($tipooper[$i]['NomConceptooperacion']);
	   }
	   $standard = new ZendExt_ClassStandard();
	   return $standard->ArrayObject($tipooper);
	}
	public function OperacionesPorDocumento($alias,$idestructura=0,$subsistema=0)
	{	    
 		$integrator = ZendExt_IoC::getInstance ();
		$estructurasubsist = $integrator->subsistemas->BuscarInstancia($idestructura,$subsistema);
	    
	    $xml = ZendExt_FastResponse::getXML("documentos");
		$aliasx = $xml->$alias;
		$aliasx = utf8_encode($aliasx['alias']);
		
		$tipooper = DatOperacionCont::OperacionesPorDocumento($aliasx,$estructurasubsist->idestructurasubsist);
		if(!$tipooper)return array();
		$i=0;
		foreach($tipooper as $op)
		{
			$final[$i]['idoperacion'] = $op['idoperacion'];
			$final[$i]['denominacion'] = $op['NomOperacione']['denominacion'];
			$final[$i]['idnomoperaciones'] = $op['NomOperacione']['idnomoperaciones'];
			$final[$i]['idconcepto'] = $op['NomConceptooperacion']['idconceptooperacion'];
			$final[$i]['concepto'] = $op['NomConceptooperacion']['denominacionconcepto'];
			$final[$i++]['signo'] = $op['NomConceptooperacion']['signoconcepto'];
		}
		$standard = new ZendExt_ClassStandard();
		return $standard->ArrayObject($final);
	}
	public function OperacionesPorId($idoperacion)
	{
	   $tipooper = DatOperacionCont::OperacionPorId($idoperacion);
	   if(!$tipooper)return new stdClass();	   
	   foreach($tipooper as $i=>$top)
	   {
	      $tipooper[$i]['denominacion'] = $top['NomOperacione']['denominacion'];
		  unset($tipooper[$i]['NomOperacione']);
		  $tipooper[$i]['idconcepto'] = $top['NomConceptooperacion']['idconceptooperacion'];
		  $tipooper[$i]['idnomoperaciones'] = $top['NomOperacione']['idnomoperaciones'];
		  $tipooper[$i]['concepto'] = $top['NomConceptooperacion']['denominacionconcepto'];
		  $tipooper[$i]['signo'] = $top['NomConceptooperacion']['signoconcepto'];
		  unset($tipooper[$i]['NomConceptooperacion']);
	   }
	   $standard = new ZendExt_ClassStandard();
	   return $standard->Object($tipooper);
	}
	public function CuentaPorOperacion($idoperacion)
	{
	   $tipooper = DatOperacionCont::CuentaPorOperacion($idoperacion);
	   if(!$tipooper)return NULL;	   	   
	   return $tipooper[0]['idcuenta'];
	}
	public function InsertarDocumentosAEntidad($subsistema,$docs)
	{
		$estrucsubsis = $this->integrator->parametros->EncuentraIdestructurasubsist($subsistema);
		if (count($docs))
		{
			$docprimModel = new DatDocumentoprimModel();
			foreach($docs as $id)
			{
				$docprim = new DatDocumentoprim();
				$docprim->idestructurasubsist = $estrucsubsis;
				$docprim->iddocumentos = $id;
				$docprim->version = 0;
				$docprimModel->insertarDatDocumentoprim($docprim);
			}
		}
	}
	
	public function OperacionSubsistEnt($subsistema=0,$entidad=0)
	{
	    if($subsistema == 0)
		{
			$subsistema = $this->global->Subsistema->idsubsistema;
		}
		$estrucsubsis = $this->integrator->parametros->EncuentraIdestructurasubsist($subsistema);
		
		$operaciones = DatOperacionCont::OperacionSubsistEnt($estrucsubsis);
		
		$final = array();
		$i=0;
		foreach($operaciones as $op)
		{
			$final[$i]['idoperacion'] = $op['idoperacion'];
			$final[$i]['debitcredito'] = $op['debitcredito'];
			$final[$i]['denominacion'] = $op['NomOperacione']['denominacion'];
			$final[$i]['idconcepto'] = $op['NomConceptooperacion']['idconceptooperacion'];
			$final[$i]['concepto'] = $op['NomConceptooperacion']['denominacionconcepto'];
			$final[$i++]['signo'] = $op['NomConceptooperacion']['signoconcepto'];
		}
		$standard = new ZendExt_ClassStandard();
		return $standard->ArrayObject($final);
	}
	
	public function ObjetoPorOperacion($idoperacion)
	{
	    $objeto = DatOperacionCont::ObjetoPorOperacion($idoperacion);
		$final = array();
		$i=0;
		foreach($objeto as $op)
		{
			$final[$i]['idobjeto'] = $op['idobjeto'];
			$final[$i++]['denominacion'] = $op['DatObjeto']['NomObjeto']['denominacion'];
		}
		$standard = new ZendExt_ClassStandard();
	    return $standard->Object($final);
	}
	public function ObjetoPorSubsistema($subsistema = 0 )
	{
	    if($subsistema == 0)
		{
			$subsistema = $this->global->Subsistema->idsubsistema;
		}
		$estrucsubsis = $this->integrator->parametros->EncuentraIdestructurasubsist($subsistema);
		$objeto = DatObjeto::ObtenerObjPorSubsist($estrucsubsis);
		
		$i = 0;
		foreach($objeto as $op)		
			$final[] =array('idobjeto' => $op['idobjeto'],'denominacion'=>$op['NomObjeto']['denominacion']);	
		
        if(count($objeto))
        return ZendExt_ClassStandard::ArrayObject($final);
	    return array();

	}
	public function OperacionesPorObjeto($idobjeto)
	{
	    $objeto = DatOperacionCont::OperacionesPorObjeto($idobjeto);		
		$final = array();
		$i=0;
		foreach($objeto as $op)
		{
			$final[$i]['idoperacion'] = $op['idoperacion'];
			$final[$i]['denominacion'] = $op['NomOperacione']['denominacion'];
			$final[$i]['idcuenta'] = $op['idcuenta'];
			$final[$i]['debitcredito'] = $op['debitcredito'];
			$final[$i]['contabilidadadicional'] = $op['contabilidadadicional'];
			$final[$i++]['iddoc'] = $op['iddoc'];						
		}
		$standard = new ZendExt_ClassStandard();
	    return $standard->ArrayObject($final);
	}
	public function CuentasContrPorObjeto($idobjeto, $subsistema = 0)
	{  
		if($subsistema == 0)
		{
			$subsistema = $this->global->Subsistema->idsubsistema;
		}
		$idestructurasubsist =$this->integrator->parametros->EncuentraIdestructurasubsist($subsistema);		
	   
		$cuentas = DatCuentaobjeto::CuentasContrPorObjeto($idobjeto, $idestructurasubsist);	
		$standard = new ZendExt_ClassStandard();
	    return $standard->ArrayObject($cuentas);
	}
	public function HayReglasContables($entidad)
	{
		$subs = $this->integrator->parametros->BuscarSubsistemasPorEntidad($entidad);
		foreach($subs as $i => $v)
			$subsistemas[$i] = $subs[$i]->idestructurasubsist;
		$obj = new DatObjeto();
		return $obj->HayReglasContables($entidad,$subsistemas);
	}
	
	public function ObtenerDocumentoPrimPorId($iddocprim)
	{
		$doc = DatDocumentoprim::BuscarDocumentoPrimPorId($iddocprim);
		$standard = new ZendExt_ClassStandard();
	    return $standard->Object($doc);
	}
	
	public function ObtenerIdDocPorIdDocNom($identidad,$idsubsistema,$iddocnom)
	{
		$estructurasubsist = $this->integrator->subsistemas->BuscarInstancia($identidad, $idsubsistema);
		$id = DatDocumentoprim::ObtenerIdDocPorIdDocNom($estructurasubsist->idestructurasubsist,$iddocnom);
		return $id;
	}
	
	public function OperacionesPorIds($arrayId)
	{
		$operaciones = DatOperacionCont::OperacionesPorId($arrayId);		
		if(empty($operaciones))return array();
		$i=0;
		//print_r($operaciones);
		foreach($operaciones as $op)
		{   foreach($op as $o){
			$final[$i]['idoperacion'] = $o['idoperacion'];
			$final[$i]['denominacion'] = $o['NomOperacione']['denominacion'];
			$final[$i++]['codigooperacion'] = $o['NomOperacione']['codigooperacion'];
			}
		}
		$standard = new ZendExt_ClassStandard();
	    return $standard->ArrayObject($final);
	}
	
	public function DocumentosPorSubsistema($subsistema = 0)
	{
		if($subsistema == 0)
		{
			$subsistema = $this->global->Subsistema->idsubsistema;
		}
		$idestructurasubsist = $this->integrator->parametros->EncuentraIdestructurasubsist($subsistema);
		$docs = DatDocumentoprim::buscar(array('idestructurasubsist'=>$idestructurasubsist));
		$final = array();
		$i=0;
		foreach($docs['datos'] as $doc)
		{   
			$final[$i]['iddoc'] = $doc['iddoc'];
			$final[$i]['denominacion'] = $doc['NomDocprim']['denominacion'];
			$final[$i]['codigo'] = $doc['NomDocprim']['codigo'];
			$final[$i]['iddocumentos'] = $doc['NomDocprim']['iddocumentos'];
			$final[$i++]['concepto'] = $doc['NomDocprim']['concepto'];
		}
		$standard = new ZendExt_ClassStandard();
	    return $standard->ArrayObject($final);
	}
	
	public function TipoOperacionesObjDoc($aliasdoc,$aliasobj,$subsistema = 0)
	{
		$xml = ZendExt_FastResponse::getXML("documentos");
		$aliasx = $xml->$aliasdoc;
		$aliasx = utf8_encode($aliasx['alias']);
		$idestructurasubsist = $this->integrator->parametros->EncuentraIdestructurasubsist($subsistema);
		$operaciones = DatOperacionCont::TipoOperacionesObjDoc($aliasx,$aliasobj,$idestructurasubsist);
		foreach($operaciones as $i => $op)
			$operaciones[$i]['denominacion'] = $op['NomOperacione']['denominacion'];
		$standard = new ZendExt_ClassStandard();
	    return $standard->ArrayObject($operaciones);
	}
	public function ObtenerNomdocs()
	{
		return NomDocprim::buscar();
	}
	
	public function ObtOperPorIdN($idnomoperacion,$identidad,$idsubsistema)
	{
		$integrator = ZendExt_IoC::getInstance ();
		$estructurasubsist = $integrator->subsistemas->BuscarInstancia($identidad,$idsubsistema);
	    	    											
		$operacion = DatOperacionCont::ObtOperPorIdN($idnomoperacion,$estructurasubsist->idestructurasubsist);
		$final = array();
		$i = 0;
		foreach($operacion as $op)
		{
			$final[$i]['idoperacion'] = $op['idoperacion'];
			$final[$i]['idobjeto'] = $op['idobjeto'];
			$final[$i]['denominacion'] = $op['NomOperacione']['denominacion'];
			$final[$i]['idnomoperaciones'] = $op['NomOperacione']['idnomoperaciones'];
			$final[$i]['idconcepto'] = $op['NomConceptooperacion']['idconceptooperacion'];
			$final[$i]['concepto'] = $op['NomConceptooperacion']['denominacionconcepto'];
			$final[$i++]['signo'] = $op['NomConceptooperacion']['signoconcepto'];
		}
		//print_r($final);
		$standard = new ZendExt_ClassStandard();
	    return $standard->Object($final);
	}
	
	public function ObtOperacionesPorIds($idsoperacion)
	{		
	    	    											
		$operaciones = DatOperacionCont::ObtOperacionesPorIds($idsoperacion);
		if(empty($operaciones))return array();		
		$final = array();
		$i = 0;
		foreach($operaciones as $op)
		{
			$final[$i]['idoperacion'] = $op['idoperacion'];
			$final[$i]['idobjeto'] = $op['idobjeto'];
			$final[$i]['denominacion'] = $op['NomOperacione']['denominacion'];
			$final[$i]['idnomoperaciones'] = $op['NomOperacione']['idnomoperaciones'];
			$final[$i]['idconcepto'] = $op['NomConceptooperacion']['idconceptooperacion'];
			$final[$i]['concepto'] = $op['NomConceptooperacion']['denominacionconcepto'];
			$final[$i++]['signo'] = $op['NomConceptooperacion']['signoconcepto'];
		}
		//print_r($final);
		$standard = new ZendExt_ClassStandard();
	    return $standard->ArrayObject($final);
	}
	
	public function ObtResConcpIdsOperaciones($idsoperacion)
	{		
	    	    											
		$operaciones = DatOperacionCont::ObtOperacionesPorIds($idsoperacion);
		if(empty($operaciones))return array();		
		$final = array();
		$i = 0;		
		$enc = array();
		foreach($operaciones as $op)
		{
		    if(empty($enc[$op['NomConceptooperacion']['idconceptooperacion']]))
			{				
				$final[$i]['idconcepto'] = $op['NomConceptooperacion']['idconceptooperacion'];
				$final[$i]['concepto']   = $op['NomConceptooperacion']['denominacionconcepto'];
				$final[$i++]['signo']    = $op['NomConceptooperacion']['signoconcepto'];
				$enc[$op['NomConceptooperacion']['idconceptooperacion']] = $op['idoperacion'];
			}			
		}
		//print_r($final);
		$standard = new ZendExt_ClassStandard();
	    return $standard->ArrayObject($final);
	}
	
	public function TipoOperacObjDoc($iddocumento,$denomobj,$identidad,$idsubsistema)
	{	   		
        $integrator = ZendExt_IoC::getInstance ();	
	    $estructurasubsist = $integrator->subsistemas->BuscarInstancia($identidad,$idsubsistema);
		$operacion = DatOperacionCont::TipoOperacObjDoc($iddocumento,$denomobj,$estructurasubsist->idestructurasubsist);
		$final = array();
		$i = 0;
		foreach($operacion as $op)
		{
			$final[$i]['idoperacion'] = $op['idoperacion'];
			$final[$i]['idobjeto'] = $op['idobjeto'];
			$final[$i]['denominacion'] = $op['NomOperacione']['denominacion'];
			$final[$i]['idnomoperaciones'] = $op['NomOperacione']['idnomoperaciones'];
			$final[$i]['idconcepto'] = $op['NomConceptooperacion']['idconceptooperacion'];
			$final[$i]['concepto'] = $op['NomConceptooperacion']['denominacionconcepto'];
			$final[$i++]['signo'] = $op['NomConceptooperacion']['signoconcepto'];
		}
		if(empty($final))return array();
		$classstandard = new ZendExt_ClassStandard();
		return $classstandard->ArrayObject($final);		
	}
	
	public function OperacionCargaInicial()
	{	   		
        $operacinic = DatOperacionCont::OperacionCargaInicial();
		return $operacinic[0]['idoperacion'];	
	}
	
	public function ObtContabAdicional($idoperacion)
	{
		$contabilidadadd = DatContabilidadadicional::buscarContabdadicional($idoperacion);
		if(empty($contabilidadadd))return array();
		$classstandard = new ZendExt_ClassStandard();
		return $classstandard->ArrayObject($contabilidadadd);
	}
	
	public function ObtConcOperSumRest()
	{
		$concpop = NomConceptooperacion::ObtConcOperSumRest();
		if(empty($concpop))return array();
		$classstandard = new ZendExt_ClassStandard();
		return $classstandard->ArrayObject($concpop);
	}

	public function ObtIdDocPorIdOper($idoperacion)
	{
		$iddocumentos = DatOperacion::ObtIdDocPorIdOper($idoperacion);
		$classstabdar = new ZendExt_ClassStandard();
		return $classstabdar->ArrayObject($iddocumentos);
	}
	
	public function ObtenerOperacionesPorCuenta($idcuenta)
	{
		$operaciones = DatOperacion::ObtenerOperacionesPorCuenta($idcuenta);
		return $operaciones;
	}

        public function ObtenerSubsistPorIdDoc($iddoc) {
            $DatDocumentoprim = DatDocumentoprim::BuscarPorId($iddoc);
            $idestructurasubsist = $DatDocumentoprim[0]['idestructurasubsist'];
            $ids = $this->integrator->parametros->BuscarSubsistemaEntidad($idestructurasubsist);
            return $ids->idsubsistema;
        }
}
?>