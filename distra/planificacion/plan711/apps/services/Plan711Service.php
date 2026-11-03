<?php

class Plan711Service {

    public function Productos711DadoEntidad(
        $identidad,
        $arrayIdsolicitud711,    
        $anno,
        $denominacion,
        $numeropieza,
        $codigo,
        $denominacionunidadmedida,
        $abreviaturaunidadmedida,
        $nosolicitud,    
        $idumedida
    ) {
        $params['identidad']=$identidad;
        $params['arrayIdsolicitud711']=$arrayIdsolicitud711;
        $params['nosolicitud']=$nosolicitud;
        $params['anno']=$anno;
        $params['denominacion']=$denominacion;
        $params['numeropieza']=$numeropieza;
        $params['codigo']=$codigo;
        $params['denominacionunidadmedida']=$denominacionunidadmedida;
        $params['abreviaturaunidadmedida']=$abreviaturaunidadmedida;
        $params['idumedida']=$idumedida; 
        $resultaconsulta = DatProducto711::Productos711DadoEntidad(
                        $params
        );
//        foreach ($resultaconsulta as $key => $value) {
//            $solicitudes=$value['arregloidsolicitud'];
//            $solicitudes=str_replace('{', '', $solicitudes);
//            $solicitudes=str_replace('}', '', $solicitudes);
//            $resultaconsulta[$key]['idsolicitudes']= split(',', $solicitudes);
//            $cantidades=$value['arreglocantidad'];
//            $cantidades=str_replace('{', '', $cantidades);
//            $cantidades=str_replace('}', '', $cantidades);
//            $resultaconsulta[$key]['cantidades']= split(',', $cantidades);
//        }
        return $resultaconsulta;
    }
    public function Solicitudes711DadoEntidad(
        $identidad,
        $anno,
        $descripcion,
        $nosolicitud,
		$start,
		$limit,
		$serv
    ) {
        $params['identidad']=$identidad;
        $params['nosolicitud']=$nosolicitud;
        $params['anno']=$anno;
        $params['descripcion']=$descripcion;
		$params['start']=$start;
		$params['limit']=$limit;
		$params['serv']=$serv;
        
        $resultaconsulta = DatSolicitud711::listarSolicitudes711(
                        $params
        );
        return $resultaconsulta;
    }
	    
    public function ActualizarSolicitudes711(
        $idsolicitud711,
        $arrayidindicadores
    ) {
        $params['idsolicitud711']=$idsolicitud711;
        $params['arrayidindicadores']=$arrayidindicadores;
        
        /*$resultaconsulta = DatSolicitud711::listarSolicitudes711(
                        $params
        );*/
        return 1;
    }	

}
