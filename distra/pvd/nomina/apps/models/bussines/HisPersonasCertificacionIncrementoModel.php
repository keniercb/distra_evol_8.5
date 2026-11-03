<?php

class HisPersonasCertificacionIncrementoModel extends ZendExt_Model
{

    public function HisPersonasCertificacionIncrementoModel()
    {
        parent::ZendExt_Model();
    }

    public function addPersonasCerthistorico($arregloDatos)
    {
    //    print_r($arregloDatos);die;

        if ($arregloDatos != null)
        {
            foreach ($arregloDatos as $i => $valor)
            {
                if($valor->idpersonacertificacionincremento != null)
                {
                    $objPersonasCertif =  Doctrine::getTable('ConfPersonasCertificacionIncremento')->find($valor->idpersonacertificacionincremento);
                    $obj = new HisPersonasCertificacionIncremento();
                    $obj->idpersona = $objPersonasCertif->idpersona;
                    $obj->annosserventidadincremental = $objPersonasCertif->annosserventidadincremental ;
                    $obj->mesesserventidadincremental = $objPersonasCertif->mesesserventidadincremental ;
                    $obj->idestructura = $objPersonasCertif->idestructura;
                    $obj->incremento = $objPersonasCertif->incremento;
                    $obj->fecha = $objPersonasCertif->fecha;
                    $obj->save();
                }

            }
        }

    }
    public function getHisPersonasCertificacionInc($identidad,$fecha)
    {
        $arrayPersonas = HisPersonasCertificacionIncremento::getHisPersonasxEntidad($identidad,$fecha);

        $arrayDatos = array();
        $cont = 0;
        $ioc = ZendExt_IoC_Inter::getInstance();

        foreach ($arrayPersonas as $i => $valor)
        {
            $datospersona = $ioc->pvd->getPrincipalesDatosPersona(array($valor['idpersona']),null,null,null,null,null);
            $datoscargos = DatCargosOcupados::obtenerListadoCargosOcupadosActual($valor['idpersona'],$valor['idestructura'], $inicio = 0, $limite = 15) ;
            $arrayDatos[$cont]['idpersona'] = $valor['idpersona'] ;
            $arrayDatos[$cont]['nombreplantilla'] = $valor['nombreplantilla'] ;
            $arrayDatos[$cont]['nombreapellidos']= $datospersona->data[0]['nombre'].' '.$datospersona->data[0]['snombre'].' '.$datospersona->data[0]['papel'].' '.$datospersona->data[0]['sapel'];
            $arrayDatos[$cont]['numid']= $datospersona->data[0]['numid'];
            $arrayDatos[$cont]['idestructura']=$valor['idestructura'];
            $arrayDatos[$cont]['idcargo']= $datoscargos[0]['idcargo'];
            $arrayDatos[$cont]['incremento']= $valor['incremento'] ;
            $arrayDatos[$cont]['fecha']= $valor['fecha'];
            $arrayDatos[$cont]['fdesde']= $valor['fdesde'];
            $cont++;
        }

        return $arrayDatos;
    }


}
