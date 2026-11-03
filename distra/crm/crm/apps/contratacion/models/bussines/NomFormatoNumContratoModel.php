<?php

/**
 * Created by PhpStorm.
 * User: alberto
 * Date: 06/10/2015
 * Time: 3:51
 */
class NomFormatoNumContratoModel extends ZendExt_Model
{
    private $listNomencladores;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->initListNomencladores();
    }

    private function initListNomencladores()
    {
        $this->listNomencladores[1] = array('denominacion'=> "Tipos de clientes", 'nombreparametro'=>'cliente');
        $this->listNomencladores[2] = array('denominacion'=> "Sector", 'nombreparametro'=>'idsector');
        $this->listNomencladores[3] = array('denominacion'=> "Tipo de contrato", 'nombreparametro'=>'idtipocontrato');
	    $this->listNomencladores[4] = array('denominacion'=> "Area", 'nombreparametro'=>'idarea');
	    $this->listNomencladores[5] = array('denominacion'=> "Persona", 'nombreparametro'=>'idpersona');
	    $this->listNomencladores[6] = array('denominacion'=> "Cliente final", 'nombreparametro'=>'idclientefinal');
	    $this->listNomencladores[7] = array('denominacion'=> "Destino comercial", 'nombreparametro'=>'iddestinocomercial');
    }

    public function getNomencladores()
    {
        $result = array();
        
        foreach($this->listNomencladores as $key=>$value){
            array_push($result, array(
                'idnomenclador' => $key,
                'denominacion' => $value['denominacion'],
                'nombreparametro' => $value['nombreparametro'],
            ));
        }

        return $result;
    }

    public function getNomencladorElementos($idnomenclador)
    {
        if($idnomenclador == 1){
            return array(
                array('idnomelement' => 1, 'nomvalor' => 'Cliente'),
                array('idnomelement' => 2, 'nomvalor' => 'Proveedor')
            );
        }elseif($idnomenclador == 2){
            $sectores = NomSector::getSectores();

            $result = array();
            foreach ($sectores as $val){
                array_push($result, array(
                    'idnomelement' => $val['idsector'],
                    'nomvalor' => $val['denominacion']
                ));
            }

            return $result;
        }elseif($idnomenclador == 3){
            $tipoContrato = (new DatTipoContrato)->cargartipocontrato($this->global->Estructura->idestructura);
            
            $result = array();
            foreach ($tipoContrato as $val){
                array_push($result, array(
                    'idnomelement' => $val['idtipocontrato'],
                    'nomvalor' => $val['denominacion']
                ));
            }

            return $result;
        }elseif($idnomenclador == 4){
			$areas = (new DatArea)->getAreas()['data'];
			
			$result = array();
            foreach ($areas as $val){
                array_push($result, array(
                    'idnomelement' => $val['idestructura'],
                    'nomvalor' => $val['nombre']
                ));
            }

            return $result;
		}elseif($idnomenclador == 5){
            $areas = (new DatPersonaParametro())->getPersonasParametro()['data'];

            $result = array();
            foreach ($areas as $val){
                array_push($result, array(
                    'idnomelement' => $val['idpersona'],
                    'nomvalor' => $val['nombre']
                ));
            }

            return $result;
        }elseif($idnomenclador == 6){
            $clientesfinales = (new NomClienteFinal())->getClientesFinales();

            $result = array();
            foreach ($clientesfinales as $val){
                array_push($result, array(
                    'idnomelement' => $val['idclientefinal'],
                    'nomvalor' => $val['denominacion']
                ));
            }

            return $result;
        }elseif($idnomenclador == 7){
            $destinoscomerciales = (new NomDestinoComercial())->getDestinoComercial();

            $result = array();
            foreach ($destinoscomerciales as $val){
                array_push($result, array(
                    'idnomelement' => $val['iddestinocomercial'],
                    'nomvalor' => $val['denominacion']
                ));
            }

            return $result;
        }

    }
} 