<?php

class PlanModel extends ZendExt_Model
{

    public function cargarPlanes($filtro)
    {
        $datplan = new DatPlanPatrimonio();
        $arrPlanes = $datplan->obtenerPlanes($filtro);

        foreach ($arrPlanes as $index => $plan) {
            $propuesto = $this->integrator->seguridad->getUsersProfile(array($plan['idpropuestopor']),
                $this->global->Perfil->certificado);
            
            $arrPlanes[$index]['propuestopor'] = $propuesto[0]['usuario'];
           
            $aprobado = $this->integrator->seguridad->getUsersProfile(array($plan['idaprobadopor']),
                $this->global->Perfil->certificado);
             
            $arrPlanes[$index]['aprobadopor'] = $aprobado[0]['usuario'];
           
           // $especialidad = ZendExt_IoC::getInstance()->integrator->parametros->ObtenerEspecialidadPorId($plan['idespecialidad']);
            
            $arrPlanes[$index]['descespecialidad'] = $plan['idespecialidad'];            

            if ($plan['estado'] == 1)
                $arrPlanes[$index]['denominacionEstado'] = 'Elaboraci&oacute;n';
            if ($plan['estado'] == 2)
                $arrPlanes[$index]['denominacionEstado'] = 'Preparado ';
            if ($plan['estado'] == 5)
                $arrPlanes[$index]['denominacionEstado'] = 'Aprobado ';
        }
        return $arrPlanes;
    }

    public function modificarPlan($parametros)
    {

        $versiexisteano = Doctrine::getTable('DatPlanPatrimonio')->find($parametros['idplan']);
        $versiexisteano->plan = $parametros['plan'];
        $versiexisteano->save();
        return 1;
    }

    public function adicionarPlanes($parametros)
    {
        $idsusuario = $this->global->Perfil->idusuario;
        $datplan = new DatPlanPatrimonio();
        return $datplan->adicionarPlanes($parametros, $idsusuario);
    }

    public function eliminarplan($idsplan)
    {
        $datplan = new DatPlanPatrimonio();
        $datplan->eliminarplan($idsplan);
    }

    public function confaprobarcancelarplan($parametros)
    {   
        $datplan = new DatPlanPatrimonio();
        if ($parametros['idestado'] == 5) {            
            $parametros['idaprobadopor'] = $this->global->Perfil->idusuario;
        }
        return $datplan->confaprobarcancelarplan($parametros);
    }

    public function cargarEspecialidad()
    {
        $datos = ZendExt_IoC::getInstance()->integrator->parametros->ObtenerEspecialidadesHojas();
        return $datos; //array( 'datos' => $datos, 'total' => count( $datos ) ) ;
    }

}

?>
