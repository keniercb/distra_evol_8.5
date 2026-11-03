<?php

class SegTrazaCertificacionAnnoServc extends BaseSegTrazaCertificacionAnnoServc {


	public function setUp()
	{
		parent :: setUp ();
	}

	public function getByid($idtrazacertificacionannoservc)
	{
		return Doctrine::getTable('SegTrazaCertificacionAnnoServc')->find($idtrazacertificacionannoservc);
	}


	public function addTraza($objeto,$usuario)
	{
	/*	print_r($usuario);die;*/
		$obj = new SegTrazaCertificacionAnnoServc();
		$obj->idcertificacionannoservc 	= $objeto->idcertificacion;
		$obj->idusuario         		= $usuario;
		$obj->annosajuste         		= $objeto->annosajuste;
		$obj->mesesajuste         		= $objeto->mesesajuste;
		$obj->save();

	}
    
}
