<?php

/**
 * Modelo de negocio para gestionar las plantillas nominales.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Modelo de negocio
 * @uses GestSubordinacionModel (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class GestSubordinacionModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function GestSubordinacionModel() {
        parent::ZendExt_Model();
    }
	
	public function asociarSubordinados($idjefe, $arraycargos){
	  //Recorriendo los cargos para adicionar la subordinacion
	  foreach($arraycargos as $i=>$value){
	    //Obj del Domain
	    $objsubordinacion = new ConfSubordinacion();
		$existesubordinacion = $objsubordinacion->existeSubordinado($idjefe, $value);
		if($existesubordinacion == 0){
	    $objsubordinacion->idjefe = $idjefe;
	    $objsubordinacion->idsubordinado = $value;
		//Salvando el obj
		$objsubordinacion->save();
		}
	  }
	  return 'Ok';
	}
	
	public function desasociarSubordinados($arraycargos){
	  //Recorriendo los cargos para adicionar la subordinacion
	  foreach($arraycargos as $i=>$value){
	    //Obj del Domain
	    $objsubordinacion = new ConfSubordinacion();
	    $objsubordinacionxidjefe = $objsubordinacion->obtenerObjConfSubordinacionDadoId($value);
		$objsubordinacionxidjefe->delete();
	  }
	  return 'Ok';
	}
	
	public function obtenerListadoSubordinados($idjefe){
	  //Obj del Domain
	  $objsubordinacion = new ConfSubordinacion();
	  //Obteniendo los datos de los subordinados
	  $arraysubordinadosdomain = $objsubordinacion->obtenerListadoSubordinados($idjefe);
	  $arraysubordinados = array();
	  $cont = 0;
	  foreach($arraysubordinadosdomain as $i=>$value){
	    //Asignandole datos al array a devolver
	    $arraysubordinados[$cont]['idsubordinacion'] = $value['idsubordinacion'];
	    $arraysubordinados[$cont]['idjefe'] = $value['idjefe'];
	    $arraysubordinados[$cont]['idsubordinado'] = $value['idsubordinado'];
		//Dame los datos del cargo
		$datosestructura = $this->integrator->metadatos->DameEstructura($value['idsubordinado']);
		$arraysubordinados[$cont]['denomcargo'] = '<img src="'.$datosestructura[0]->icon.'" height=16 width=16 />'." ".$datosestructura[0]->denominacion;
		//Dame la ruta para la descripcion
		$arrCaminosCargos = $this->integrator->metadatos->getRutaEstructura($value);
		$arrcaminoid = explode('/',$arrCaminosCargos[count($arrCaminosCargos)-1]['rutaId']);
		$texto = "";
		foreach($arrcaminoid as $cc=>$rid){
		   //Dame los datos de la estructura
		   $datosestructuracamino = $this->integrator->metadatos->DameEstructura($rid);
		   if($texto == ""){
		    $texto = '<img src="'.$datosestructuracamino[0]->icon.'" height=16 width=16 />'." ".$datosestructuracamino[0]->denominacion."/";
		   }else{
		    $texto = $texto.'<img src="'.$datosestructuracamino[0]->icon.'" height=16 width=16 />'." ".$datosestructuracamino[0]->denominacion."/";
		   }
		}
		//print_r($texto);die;
	    $arraysubordinados[$cont]['descripcion'] = $texto;
		$cont++;
	  }
	  
	  return $arraysubordinados;
	}
	
	public function existeSubordinado($idjefe, $idsubordinado){
	  //Obj del Domain
	  $objsubordinacion = new ConfSubordinacion();
	  $existe = $objsubordinacion->existeSubordinado($idjefe, $idsubordinado);
	  return $existe;
	
	}
	
	public function obtenerDatosPersonasSubordinadas($idjefe){
	  $arraypersonas = array();
	  $cont = 0;
	  //Obj del Domain
	  $objsubordinacion = new ConfSubordinacion();
	  $arrcargossubordinados = $objsubordinacion->obtenerCargosSubordinado($idjefe);
	  foreach($arrcargossubordinados as $i=>$value){
	    //SQl con los datos de las personas 
		$sql = "select dp.idpersona, dp.nombre,dp.snombre, dp.papel, dp.sapel
			    from mod_persona.dat_persona dp
				inner join mod_nomina.dat_cargosocupados cop on (cop.idpersona = dp.idpersona)
				inner join mod_nomina.conf_subordinacion csub on (csub.idsubordinado = cop.idcargo)
				where csub.idsubordinado = ?; ";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$arraydatospersonas = $conn->fetchAll($sql, array($value['idsubordinado']));
		if(count($arraydatospersonas)>0){
		 foreach($arraydatospersonas as $i=>$value){
		  $arraypersonas[$cont]['idpersona'] = $value['idpersona'];
		  $arraypersonas[$cont]['nombreapp'] = $value['nombre'].' '.$value['snombre'].' '.$value['papel'].' '.$value['sapel'];
		  $arraypersonas[$cont]['descripcion'] = '';
		  $cont++;
		 }
		}
	  }
	  return $arraypersonas;
	
	}

   
}