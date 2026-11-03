<?php

/**
 * @autor Adrian Fernández Martínez
 */
class GestarearesponsabilidadModel extends BaseModel
{
    /**
     *
     */
    private $_mComunAFT;
    private $serviciosEyC;

    public function __construct()
    {
        parent::__construct();
        $this->_mComunAFT = ComunAFTModel::getInstance();
        $this->serviciosEyC = ServiciosEstructuraComposicionHelper::__init();
    }

    /**
     *
     */
    public function getAreaById($nodo, $idestructura, $soloEntidades)
    {
        if (!$nodo) {
            $nodo = $idestructura;
        }
        $iddominio = $this->global->Perfil->iddominio;
        $estructuras = $this->serviciosEyC->BuscarEntidadbyDominio($iddominio);
        //print_r($estructuras);die;
        // En este metodo se cargan las entidades si existen,
        //  si no hay entidades se cargan las areas de responsabilidad.

        if (count($estructuras) > 0) {
            $datos = $estructuras;
        } else {

            $logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();
            $depositos = $logistEstrucUbica->cargardepositos(null, null, null, null, null, 0, true, null);
            $estructurasHijas = $this->_mComunAFT->getEstructurasHijas($nodo, true, true);
            $index = 0;

            foreach ($depositos['depositos'] as $depos) {
                foreach ($estructurasHijas as $estructuraHi) {
                    if ($depos['id'] == $estructuraHi['id']) {
                        $datos[$index] = $estructuraHi;
                        $index++;
                    }
                }
            }
            if($nodo == $idestructura){
                $datos = $this->cargarAreasRaiz($datos, $nodo, $idestructura,true);
            }else
                $datos = $this->cargarAreasRaiz($datos, $nodo, $idestructura, false);

           // print_r($datos);die;
            // $this->datos = $datos;
        }

        /* $iddominio = $this->global->perfil->iddominio;

          $areas = $this->serviciosEyC->obtenerEstructurasNoFormales($iddominio, $nodo, false, null, null, null, -2);

          if(count($areas) > 0){
          foreach ($areas as $key => $value) {
          $area = array(
          'id' => $value['idfila'],
          '_parent' => $value['idpadre'],
          'idconcepto' => $value['idconcepto'],
          'orden' => $value['orden'],
          '_lft' => $value['lft'],
          '_rgt' => $value['rgt'],
          'leaf' => true,
          'text' => $value['text']
          //[icon] => data:
          );

          array_push($datos, $area);
          }
          } */

        //$data = array_merge($EyC, $datos);

        if ($soloEntidades) {

            return $this->getAreaByIdsoloEntidades($datos);
        }

        return $datos;
    }

    public function cargarAreasRaiz($datos, $nodo, $idestructura,$padre)
    {
        $index = 0;
        $indexaux = 0;
        if (count($datos) == 1) {
            if(isset($datos[0]['DatEstructuraop'])){
				$datos[0]['leaf'] = true;
				return $datos;
			}else{
				return 0;
			}
        } else {
            for ($i = 0; $i < count($datos); $i++) {
                $bandera = false;

                if($padre){
                    for ($j = 0; $j < count($datos); $j++) {
                        if ($datos[$i]['idpadre'] == $datos[$j]['idfila']) {
                            $bandera = true;
                            break;
                        }
                        if (!$bandera && $j == count($datos) - 1) {
                            if ($datos[$i]['idpadre'] == $nodo && $idestructura != $nodo) {
                                $datos[$i]['leaf'] = true;
                            }
                            $dat[$index] = $datos[$i];
                            $index++;
                        }
                    }
                }  else{
                    if ($datos[$i]['idpadre'] == $nodo) {
                        $dat[$indexaux] = $datos[$i];
                        $indexaux++;
                    }
                }

            }
        }
        return $dat;
    }

    public function getAreaByIdsoloEntidades($datos)
    {
        $result = array();
        foreach ($datos as $value) {
            if ($value['idconcepto'] == 3) {
                $result[] = $value;
            }
        }
        return $result;
    }

    public function getAreasResponsabilidad($params = false) {
        return $this->_mComunAFT->getAreasHijas($params);
    }
    public function getAreasSinregistro() {
        return $this->_mComunAFT->getAreasHijas1();
    }

}
