<?php

class DatEmbarque extends BaseDatEmbarque {
    
    public function setUp() {
        parent::setUp();
    }
    
    public function adicionarEmbarqueAccion($contrato, $accionescontrato, $formapagolista, $cubicajelista){
        //ejemplo de arreglo con acciones en contrato
        //[[1,"5084","Puesta en marcha","","",100,"2018-07-17T00:00:00"],[2,"5085","Embarques","5007","FP Mediano plazo",100,"2018-07-10T00:00:00"]]
        $newembarque = new DatEmbarque();
        $newembarque->idcontrato = $contrato;
        $newembarque->iddatosaccion = $accionescontrato[1];
        $id=$accionescontrato[3];
        if($accionescontrato[3]==''){
            $id=null;
        }
        $newembarque->iddatosff = $id;
        $newembarque->monto = floatval(str_replace(',','',$accionescontrato[5]));
        $newembarque->fechaposible = $accionescontrato[6];
        $newembarque->uricondicion = $accionescontrato[7];
        $newembarque->save();
        if(count($formapagolista)>0){
            //ejemplo de arreglo de formas de pago
//            [
//                [
//                    [2],
//                    [[2,"5077","20 pies OP",50,50,"2018-07-10T00:00:00"],[2,"5078","40 HC",50,50,"2018-07-17T00:00:00"]]
//                    ]
//                ]
            foreach ($formapagolista as $value1) {
                $newfp = new DatEmbarqueFormaPago();
                $newfp->idembarque = $newembarque->idembarque;
                $newfp->iddatosformapago = $value1[1];
                $newfp->fechaposible = $value1[5];
                $newfp->porciento = $value1[3];
                $newfp->monto = floatval(str_replace(',','',$value1[4]));
                $newfp->save();
            }
        }
        if(count($cubicajelista)>0){
            //ejemplo de arreglo de cubicajes
            //[[[2],[[2,"5076","40 pies",10],[2,"5079","Cargas agrupadas",0]]]]
            foreach ($cubicajelista as $value2) {
                $newcub = new DatEmbarqueCubicaje();
                $newcub->idembarque = $newembarque->idembarque;
                $newcub->iddatoscubicaje = $value2[1];
                $newcub->cantidad = $value2[3];
                $newcub->save();
            }
        }
    }
    
    public function eliminarCubicajes($idcontrato) {
        $conn = Doctrine_Manager::connection();
            $sqlupd = "DELETE FROM mod_plan711.dat_embarquecubicaje
                            WHERE idembarque in (SELECT dat_embarquecubicaje.idembarque
                                        FROM mod_plan711.dat_embarquecubicaje 
                                        left JOIN mod_planificacion.nom_datosnomenclador acc ON (mod_plan711.dat_embarquecubicaje.iddatoscubicaje = acc.iddatosnomenclador)
                                        left JOIN mod_plan711.dat_embarque eb ON (dat_embarquecubicaje.idembarque = eb.idembarque)
                                        left JOIN mod_plan711.dat_contrato ct ON (eb.idcontrato = ct.idcontrato)
                                        where ct.idcontrato = $idcontrato)";
            $conn->execute($sqlupd); 
            
        return 1;
    }
    
    public function eliminarFormaPagos($idcontrato) {
        $conn = Doctrine_Manager::connection();
            $sqlupd = "DELETE FROM mod_plan711.dat_embarqueformapago
                            WHERE idembarque in (SELECT dat_embarqueformapago.idembarque
                                                    FROM
                                                      mod_plan711.dat_embarqueformapago
                                                      left JOIN mod_planificacion.nom_datosnomenclador acc ON (mod_plan711.dat_embarqueformapago.iddatosformapago = acc.iddatosnomenclador)
                                                    left JOIN mod_plan711.dat_embarque eb ON (dat_embarqueformapago.idembarque = eb.idembarque)
                                                    left JOIN mod_plan711.dat_contrato ct ON (eb.idcontrato = ct.idcontrato)
                                                    where ct.idcontrato = $idcontrato)";
            $conn->execute($sqlupd); 
            
        return 1;
    }
    
    public function eliminarAccionEmbargues($idcontrato) {
        $conn = Doctrine_Manager::connection();
            $sqlupd = "DELETE FROM mod_plan711.dat_embarque
                            WHERE idcontrato = $idcontrato";
            $conn->execute($sqlupd); 
            
        return 1;
    }
}