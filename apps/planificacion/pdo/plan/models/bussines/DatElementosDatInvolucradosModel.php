<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatElementosDatInvolucradosModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(
        DatElementosDatInvolucrados $datElementosDatInvolucrados
    ) {
        $datElementosDatInvolucrados->save();
    }

    public function Actualizar(
        DatElementosDatInvolucrados $datElementosDatInvolucrados
    ) {
        $datElementosDatInvolucrados->save();
    }

    public function Eliminar($datElementosDatInvolucrados)
    {
        $datElementosDatInvolucrados->delete();
    }


    public function DameRelacionInvolPara(
        $idusuariocrea, $idtipoelemento, $fechainiciob, $fechafinb,
        $denominacionb
    ) {
        if ($fechainiciob != null) {
            $fechainiciob = $this->FormatearFecha($fechainiciob);
        }
        if ($fechafinb != null) {
            $fechafinb = $this->FormatearFecha($fechafinb);
        }
        $cero = 0;
        $uno = 1;
        $cont = 0;
        $idinvolresp = $idusuariocrea . $cero;
        $idinvolejec = $idusuariocrea . $uno;
        $arrayinvol
            = DatElementosDatInvolucrados::ExisteInvolucradoConElementos(
            $idusuariocrea, $idinvolresp, $idinvolejec, $idtipoelemento,
            $fechainiciob, $fechafinb, $denominacionb
        );
        $cont = count($arrayinvol);
        $arraygrupos
            = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $idusuariocrea
        );
        if (isset($arraygrupos[0])) {
            foreach (
                $arraygrupos as /*$key => */
                $grupo
            ) {
                $idgrupo = $grupo['idgrupo'];
                $idinvolresp = $idgrupo . $cero;
                $idinvolejec = $idgrupo . $uno;
                $arrayginvol
                    = DatElementosDatInvolucrados::ExisteInvolucradoConElementos(
                    $idusuariocrea = 0, $idinvolresp, $idinvolejec,
                    $idtipoelemento, $fechainiciob, $fechafinb, $denominacionb
                );
                if (isset($arrayginvol[0])) {
                    foreach ($arrayginvol as $ginvol) {
                        $arrayinvol[$cont]['idelemento']
                            = $ginvol['idelemento'];
                        $cont++;
                    }
                }
            }
        }
        if (isset($arrayinvol[0])) {
            $objelentmodel = new DatElementosModel();
            $arrayidelementsaliente = $objelentmodel->ObtenerArregloUnico(
                $arrayinvol, $arrayidelementsaliente
            );
        }
        return $arrayidelementsaliente;
    }


    public function DameRelacionInvolParaCalendario(
        $idusuariocrea, $idtipoelemento
    ) {
        $cero = 0;
        $uno = 1;
        $cont = 0;
        $idinvolresp = $idusuariocrea . $cero;
        $idinvolejec = $idusuariocrea . $uno;
        $arrayinvolresp
            = DatElementosDatInvolucrados::ExisteInvolucradoConElementos(
            $idinvolresp, $idtipoelemento
        );
        if ($arrayinvolresp) {
            foreach ($arrayinvolresp as $involresp) {
                $arrayrelacioninvol[$cont]['idinvolucrado']
                    = $involresp['idinvolucrado'];
                $arrayrelacioninvol[$cont]['idelemento']
                    = $involresp['idelemento'];
                $arrayrelacioninvol[$cont]['nivelinvol'] = 0;
                $cont++;
            }
        }
        $arrayinvolejec
            = DatElementosDatInvolucrados::ExisteInvolucradoConElementos(
            $idinvolejec, $idtipoelemento
        );
        if ($arrayinvolejec) {
            foreach ($arrayinvolejec as $involejec) {
                $arrayrelacioninvol[$cont]['idinvolucrado']
                    = $involejec['idinvolucrado'];
                $arrayrelacioninvol[$cont]['idelemento']
                    = $involejec['idelemento'];
                $arrayrelacioninvol[$cont]['nivelinvol'] = 1;
                $cont++;
            }
        }
        $arraygrupos
            = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $idusuariocrea
        );
        if ($arraygrupos) {
            foreach ($arraygrupos as $key => $grupo) {
                $idgrupo = $grupo['idgrupo'];
                $idinvolresp = $idgrupo . $cero;
                $idinvolejec = $idgrupo . $uno;
                $arrayginvolresp
                    = DatElementosDatInvolucrados::ExisteInvolucradoConElementos(
                    $idinvolresp, $idtipoelemento
                );
                if ($arrayginvolresp) {
                    foreach ($arrayginvolresp as $ginvolresp) {
                        $arrayrelacioninvol[$cont]['idinvolucrado']
                            = $ginvolresp['idinvolucrado'];
                        $arrayrelacioninvol[$cont]['idelemento']
                            = $ginvolresp['idelemento'];
                        $arrayrelacioninvol[$cont]['nivelinvol'] = 0;
                        $cont++;
                    }
                }
                $arrayginvolejec
                    = DatElementosDatInvolucrados::ExisteInvolucradoConElementos(
                    $idinvolejec, $idtipoelemento
                );
                if ($arrayginvolejec) {
                    foreach ($arrayginvolejec as $ginvolejec) {
                        $arrayrelacioninvol[$cont]['idinvolucrado']
                            = $ginvolejec['idinvolucrado'];
                        $arrayrelacioninvol[$cont]['idelemento']
                            = $ginvolejec['idelemento'];
                        $arrayrelacioninvol[$cont]['nivelinvol'] = 1;
                        $cont++;
                    }
                }
            }
        }
        if ($arrayrelacioninvol) {
            foreach ($arrayrelacioninvol as $key => $relacioninvol) {
                $arrayidelemententrante[$key]['id']
                    = $relacioninvol['idelemento'];
            }
            $objelentmodel = new DatElementosModel();
            $arrayidelementsaliente = $objelentmodel->ObtenerArregloUnico(
                $arrayidelemententrante, $arrayidelementsaliente
            );
        }
        return $arrayidelementsaliente;
    }


    public function FormatearFecha($fecha)
    {
        $fecha = explode('T', $fecha);
        $fecha = explode('-', $fecha[0]);
        $timestime = mktime(0, 0, 0, $fecha[1], $fecha[2], $fecha[0]);
        $fecha = date("j/n/Y", $timestime);//date("n/j/Y",$timestime);
        return $fecha;
    }

    public function CrearFechaInicio($fecha)
    {
        $timestime = mktime(0, 0, 0, 1, 1, 1960);
        $fecha = date("j/n/Y", $timestime);
        return $fecha;
    }

    public function CrearFechaFin($fecha)
    {
        $timestime = mktime(0, 0, 0, 12, 31, 3000);
        $fecha = date("j/n/Y", $timestime);
        return $fecha;
    }

    public function ObtenerInvolucrados($idelemento)
    {
        return DatElementosDatInvolucrados::ObtenerInvolucradosPorElemento(
            $idelemento
        );
    }
    /*public function ObtenerInvolucradosPorElementos($idelemento)
     {
       $arrayinvolucrados = DatElementosDatInvolucrados::
       GetInvolucradosPorIdElemento($idelemento);
       $arrayinvol = array();
       if(isset($arrayinvolucrados[0]['idinvolucrado']))
       {
           foreach($arrayinvolucrados as $key=>$involucrado)
           {
               $objinvol = Doctrine::getTable('DatInvolucrados'
               )->find($involucrado['idinvolucrado']);
               $arrayinvol[$key]['idinvolucrado'] = $objinvol->idinvolucrado;
               if($objinvol->tipoinvolucrado == 0)
               {
                   $arrayinvol[$key]['denominacion'] = $this->pIntegrator->
               configuracionpdo->DameDatosDeGrupo($objinvol->idgrupo)->dengrupo;

               }
               else
               {
                   $arrayinvol[$key]['denominacion'] = $this->integrator->
                    seguridad->nombreUsuario($objinvol->idusuario);
               }
               $arrayinvol[$key]['idgrupo'] = $objinvol->idgrupo;
               $arrayinvol[$key]['idusuario'] = $objinvol->idusuario;
               $arrayinvol[$key]['nivelinvolucrado'] = $objinvol->
                                                          idnivelinvolucrado;
               $arrayinvol[$key]['tipo'] = $objinvol->tipoinvolucrado;
           }
       }
       return $arrayinvol;
     }*/


}

