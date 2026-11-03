<?php

class GestionardocumentosModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function getDocumentos($idpersona,$valorevaluacion, $start = 0, $limit = 15)
    {
        try {
            $sql = "SELECT ddp.iddocumentopersona, ddp.fechacreacion, tp.denominacion as tipodocumento, 
                        ddp.iddocumentogestordocumental
                    FROM mod_evaluaciones.dat_documentopersona as ddp
                    INNER JOIN mod_evaluaciones.nom_tipodocumento as tp ON (ddp.idtipodocumento = tp.idtipodocumento)
                    WHERE ddp.idpersona = {$idpersona} and ddp.valor ilike '$valorevaluacion'";

            $sql .= " ORDER BY ddp.fechacreacion DESC";
            if ($limit) {
                $sql .= " limit {$limit}
                            offset {$start};";
            }

            $query = Doctrine_Manager::getInstance();
            $res = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

            $arrayIds = array();
            $r = array();
            foreach ($res as $key => $v) {
                $arrayIds[$key] = $res[$key]['iddocumentopersona'];
                $r[$arrayIds[$key]] = $v;
            }

            //Si la persona tiene documentos guardados gestiono los datos sino devuelvo el arreglo original que esta vacio:
            if (!empty($arrayIds)) {
                $stringIdsDoc = $this->arrayToString($arrayIds);

                $sqlCalificadores = "SELECT ddpc.iddocumentocalificador, ddpc.iddocumentopersona, 
                                        ddpc.idcalificador, nc.denominacion, dd.iddetallesdocumento, dd.detalles
                                    FROM mod_evaluaciones.dat_documentopersonacalificador as ddpc
                                    INNER JOIN mod_evaluaciones.nom_calificador as nc ON (ddpc.idcalificador = nc.idcalificador)
                                    INNER JOIN mod_evaluaciones.dat_detallesdocumento as dd ON (ddpc.iddetallesdocumento = dd.iddetallesdocumento)
                                    WHERE iddocumentopersona in ({$stringIdsDoc})";
                $calificadores = $query->getCurrentConnection()->execute($sqlCalificadores)->fetchAll(PDO::FETCH_ASSOC);

                foreach ($calificadores as $key => $v) {
                    $r[$v['iddocumentopersona']]['calificadores'] .= $v['denominacion'] . ', ';
                    $r[$v['iddocumentopersona']]['detalles'] .= '<font color="red">' . $v['denominacion'] . ': ' . '</font>' . $v['detalles'] . '</br>';
                }

                foreach ($r as $key => $v) {
                    $temp = $r[$key]['calificadores'];
                    $sincoma = substr($temp, 0, -2);
                    $r[$key]['calificadores'] = $sincoma;
                }

                $arrayFinal = array();
                $cont = 0;
                foreach ($r as $key => $v) {
                    $arrayFinal[$cont] = $v;
                    $cont++;
                }
                
                //Agrego los nombres de cada uno de los documentos que se asociaron:
                foreach ($arrayFinal as $llave => $valor) {
                    if (!empty($arrayFinal[$llave]['iddocumentogestordocumental'])) {
                        $infoDoc = $this->integrator->gestordocumental->obtenerDetallesContenido($arrayFinal[$llave]['iddocumentogestordocumental']);
                        $arrayFinal[$llave]['nombredocumento'] = $infoDoc['nombre'];
                    }
                }

                return $arrayFinal;
            } else {
                return $res;
            }
        } catch (Exeption $e) {
            throw $e;
        }
    }

    public function getCantDocumentos($idpersona,$valor)
    {
        try {
            $sql = "SELECT COUNT(ddp.iddocumentopersona) as cantidad
                    FROM mod_evaluaciones.dat_documentopersona as ddp
                    INNER JOIN mod_evaluaciones.nom_tipodocumento as tp ON (ddp.idtipodocumento = tp.idtipodocumento)
                    WHERE ddp.idpersona = {$idpersona} and ddp.valor ilike '$valor'";

            $query = Doctrine_Manager::getInstance();
            $cantidad = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            return $cantidad[0]['cantidad'];
        } catch (Exeption $e) {
            throw $e;
        }
    }

    public function eliminarDocumento($idDocumento)
    {
        try {
            $query = Doctrine_Manager::getInstance();
            $sqlUno = "SELECT ddpc.iddetallesdocumento
                    FROM mod_evaluaciones.dat_documentopersonacalificador as ddpc
                    WHERE ddpc.iddocumentopersona = {$idDocumento}
                    GROUP BY ddpc.iddetallesdocumento";
            $detalles = $query->getCurrentConnection()->execute($sqlUno)->fetchAll(PDO::FETCH_ASSOC);
                        
            foreach ($detalles as $llave => $valor) {
                $sqlElimDet = "DELETE FROM mod_evaluaciones.dat_detallesdocumento
                        WHERE iddetallesdocumento = {$detalles[$llave]['iddetallesdocumento']}";
                $query->getCurrentConnection()->execute($sqlElimDet);
            }
            
            $sqlDos = "DELETE FROM mod_evaluaciones.dat_documentopersona
                    WHERE iddocumentopersona = {$idDocumento}";            
            $query->getCurrentConnection()->execute($sqlDos);
            
            $r->success = true;
            return $r;
        } catch (Exeption $e) {
            throw $e;
        }
    }

    public function getTipoDocumento()
    {
        try {
            $sql = "SELECT idtipodocumento, denominacion FROM mod_evaluaciones.nom_tipodocumento;";
            $query = Doctrine_Manager::getInstance();
            return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getCalificadores()
    {
        try {
            $sql = "SELECT idcalificador, denominacion FROM mod_evaluaciones.nom_calificador;";
            $query = Doctrine_Manager::getInstance();
            return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function arrayToString($array)
    {
        $string = '';
        foreach ($array as $key => $value) {
            if ($key == 0) {
                $string .= $value;
            } else {
                $string .= ',' . $value;
            }
        }
        return $string;
    }

    public function adicionarDocumento($tipoDoc, $fechaCreacion, $idpersona, $arrayCalifDetalles, $valor)
    {
        try {
            $objDatDocumentopersona = new DatDocumentopersona();

            $objDatDocumentopersona->fechacreacion = $fechaCreacion;
            $objDatDocumentopersona->idtipodocumento = $tipoDoc;
            $objDatDocumentopersona->idpersona = $idpersona;
            $objDatDocumentopersona->valor = $valor;

            $objDatDocumentopersona->save();
            $iddocumentopersona = $objDatDocumentopersona->iddocumentopersona;

            foreach ($arrayCalifDetalles as $key => $v) {
                
                $objDatDetallesdocumento = new DatDetallesdocumento();
                $objDatDetallesdocumento->detalles = $arrayCalifDetalles[$key]['detalles'];
                $objDatDetallesdocumento->save();
                $iddetallesdocumento = $objDatDetallesdocumento->iddetallesdocumento;
                
                $arrayIdsCalif = split(',', $arrayCalifDetalles[$key]['idscalificadores']);
                foreach ($arrayIdsCalif as $k => $value) {
                    $objDatDocumentopersonacalificador = new DatDocumentopersonacalificador();
                    $objDatDocumentopersonacalificador->iddocumentopersona = $iddocumentopersona;
                    $objDatDocumentopersonacalificador->idcalificador = $arrayIdsCalif[$k];
                    $objDatDocumentopersonacalificador->iddetallesdocumento = $iddetallesdocumento;
                    $objDatDocumentopersonacalificador->save();
                }   
                
            }
            
            $r->success = true;
            return $r;
        } catch (Exeption $e) {
            throw $e;
        }
    }
    
    public function modificarDocumento($tipoDoc, $fechaCreacion, $idpersona, $arrayCalifDetalles, $iddocpersona, $valor)
    {
        try {            
            
            $objDatDocumentopersona = new DatDocumentopersona();
            $objDocumentopersona = $objDatDocumentopersona->getById($iddocpersona);

            $objDocumentopersona->fechacreacion = $fechaCreacion;
            $objDocumentopersona->idtipodocumento = $tipoDoc;
            $objDocumentopersona->idpersona = $idpersona;
            $objDocumentopersona->valor = $valor;

            $objDocumentopersona->save();
            
            $query = Doctrine_Manager::getInstance();
            
            $sql = "SELECT ddpc.iddetallesdocumento
                    FROM mod_evaluaciones.dat_documentopersonacalificador as ddpc
                    WHERE ddpc.iddocumentopersona = {$iddocpersona}
                    GROUP BY ddpc.iddetallesdocumento";
            $detalles = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                        
            foreach ($detalles as $llave => $valor) {
                $sqlElimDet = "DELETE FROM mod_evaluaciones.dat_detallesdocumento
                        WHERE iddetallesdocumento = {$detalles[$llave]['iddetallesdocumento']}";
                $query->getCurrentConnection()->execute($sqlElimDet);
            }
            
            //Esta parte no hace falta ya que cuando se eliminan los detalles en detallesdocumento se elimina en cascada 
            //en documentopersonacalificador:
//            $sqlElimDocxCal = "DELETE FROM mod_evaluaciones.dat_documentopersonacalificador
//                    WHERE iddocumentopersona = {$iddocpersona}";
//            $query->getCurrentConnection()->execute($sqlElimDocxCal);            

            foreach ($arrayCalifDetalles as $key => $v) {
                
                $objDatDetallesdocumento = new DatDetallesdocumento();
                $objDatDetallesdocumento->detalles = $arrayCalifDetalles[$key]['detalles'];
                $objDatDetallesdocumento->save();
                $iddetallesdocumento = $objDatDetallesdocumento->iddetallesdocumento;
                
                $arrayIdsCalif = split(',', $arrayCalifDetalles[$key]['idscalificadores']);
                foreach ($arrayIdsCalif as $k => $value) {
                    $objDatDocumentopersonacalificador = new DatDocumentopersonacalificador();
                    $objDatDocumentopersonacalificador->iddocumentopersona = $iddocpersona;
                    $objDatDocumentopersonacalificador->idcalificador = $arrayIdsCalif[$k];
                    $objDatDocumentopersonacalificador->iddetallesdocumento = $iddetallesdocumento;
                    $objDatDocumentopersonacalificador->save();
                }   
                
            }
            
            $r->success = true;
            return $r;
        } catch (Exeption $e) {
            throw $e;
        }
    }
    
    public function obtenerDatosDocumento($iddocpersona)
    {
        try {                    
            $sql = "SELECT ddp.idtipodocumento, ddp.fechacreacion
                    FROM mod_evaluaciones.dat_documentopersona as ddp
                    WHERE ddp.iddocumentopersona = {$iddocpersona}";        
                    
            $query = Doctrine_Manager::getInstance();
            $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            
            $prueba = array();                 
                    
            $sqlDos = "SELECT ddpc.iddetallesdocumento
                    FROM mod_evaluaciones.dat_documentopersonacalificador as ddpc
                    WHERE ddpc.iddocumentopersona = {$iddocpersona}
                    GROUP BY ddpc.iddetallesdocumento";
            $idDetalles = $query->getCurrentConnection()->execute($sqlDos)->fetchAll(PDO::FETCH_ASSOC);
                    
            foreach ($idDetalles as $llave => $valor) {
                
                $sqlTres = "SELECT ddpc.idcalificador
                    FROM mod_evaluaciones.dat_documentopersonacalificador as ddpc
                    WHERE ddpc.iddocumentopersona = {$iddocpersona} AND 
                        ddpc.iddetallesdocumento = {$idDetalles[$llave]['iddetallesdocumento']}";
                $idsCalificadores = $query->getCurrentConnection()->execute($sqlTres)->fetchAll(PDO::FETCH_ASSOC);
                
                $sqlCuatro = "SELECT detalles
                            FROM mod_evaluaciones.dat_detallesdocumento
                            WHERE iddetallesdocumento = {$idDetalles[$llave]['iddetallesdocumento']}";
                $detalles = $query->getCurrentConnection()->execute($sqlCuatro)->fetchAll(PDO::FETCH_ASSOC);
                
                foreach ($idsCalificadores as $k => $v) {
                    $prueba[$llave]['idcalificadores'] .= $idsCalificadores[$k]['idcalificador'] . ','; 
                }
                $temp =  $prueba[$llave]['idcalificadores'];
                $sincoma = substr($temp, 0, -1);
                $prueba[$llave]['idcalificadores'] = $sincoma;
                $prueba[$llave]['detalles'] = $detalles[0]['detalles'];
                
                $sqlCinco = "SELECT denominacion
                            FROM mod_evaluaciones.nom_calificador
                            WHERE idcalificador IN ({$prueba[$llave]['idcalificadores']})";
                $denomCalif = $query->getCurrentConnection()->execute($sqlCinco)->fetchAll(PDO::FETCH_ASSOC);
                
                foreach ($denomCalif as $key => $value) {
                    $prueba[$llave]['denomcalificadores'] .= $denomCalif[$key]['denominacion'] . ', '; 
                }
                $tempDos =  $prueba[$llave]['denomcalificadores'];
                $sincomaDos = substr($tempDos, 0, -2);
                $prueba[$llave]['denomcalificadores'] = $sincomaDos;
                
            }           
            
            $result[0]['arraycalif'] = $prueba;
            
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    public function asociarDocumento($iddocpersona, $idgestdoc)
    {
        try {
            $objDatDocumentopersona = new DatDocumentopersona();
            $objDocumentopersona = $objDatDocumentopersona->getById($iddocpersona);
            
            $objDocumentopersona->iddocumentogestordocumental = $idgestdoc;

            $objDocumentopersona->save();            
            
            $r->success = true;
            return $r;
        } catch (Exeption $e) {
            throw $e;
        }
    }
    
}
