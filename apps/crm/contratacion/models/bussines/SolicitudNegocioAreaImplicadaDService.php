<?php

/**
 * SolicitudNegocioAreaImplicadaDService
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */
class SolicitudNegocioAreaImplicadaDService
{
    private $_areaimplicadaRepository;

    public function __construct()
    {
        $this->_areaimplicadaRepository = new SolicitudNegocioAreaImplicadaRepository();
    }

    public function getAreasImplicadasFromArray($idsolicitud, $listSolicitudes)
    {
        $resul = array();

//        foreach($listSolicitudes as $value){
//            if($value['idsolicitud'] == $idsolicitud && !empty($value['idarea'])){
//                array_push($resul, array(
//                    'idarea' => $value['idarea'],
//                    'idestructura' => $value['idestructura'],
//                    'area' => $value['area']
//                ));
//            }
//        }
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $resul= $conn->fetchAll(
        "SELECT snai.idarea, snai.idestructura, COALESCE (estuc1.denominacion, estucop1.denominacion) as area
                FROM mod_crmcontratacion.dat_solicitudnegocioareaimplicada snai
                LEFT JOIN mod_estructuracomp.dat_estructura estuc1 ON (snai.idestructura = estuc1.idestructura and estuc1.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.dat_estructuraop estucop1 ON (snai.idestructura = estucop1.idestructuraop and estucop1.idproyecto = 0)
                WHERE snai.idsolicitud=".$idsolicitud
        );

        return $resul;
    }

    public function adicionarAreasImplicadas($idsolicitud, $values)
    {
        foreach($values as $key => &$value){
            $value['idsolicitud'] = $idsolicitud;
        }

        $this->_areaimplicadaRepository->insertRecordCollection($values);
    }

    public function modificarAreasImplicadas($idsolicitud, $values)
    {
        try {
            $data = $this->_areaimplicadaRepository->getRecords(array('equalSolicitud' => $idsolicitud), true);
            $indexVal = array();

            foreach ($values as $val) {
                if (strpos($val['idarea'], 'new') !== false) {
                    $val['idsolicitud'] = $idsolicitud;
                    $elem = new SolicitudNegocioAreaImplicada();
                    $elem->fromArray($val);
                    $elem->save();
                } else
                    $indexVal[$val['idarea']] = $val;
            }

            foreach ($data as $key => &$record) {
                if (array_key_exists($record->idarea, $indexVal))
                    $record->synchronizeWithArray($indexVal[$record->idarea]);
                else
                    $data->remove($key);
            }

            $data->save();
        }catch (Exception $e){
            throw $e;
        }
    }
}