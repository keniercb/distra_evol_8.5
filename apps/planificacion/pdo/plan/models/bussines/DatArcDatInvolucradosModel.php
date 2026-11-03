<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatArcDatInvolucradosModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatArcDatInvolucrados $datArcDatInvolucrados)
    {
        $datArcDatInvolucrados->save();
    }

    public function Actualizar(DatArcDatInvolucrados $datArcDatInvolucrados)
    {
        $datArcDatInvolucrados->save();
    }

    public function Eliminar($datArcDatInvolucrados)
    {
        $datArcDatInvolucrados->delete();
    }


    public function DameRelacionInvolPara($idusuariocrea)
    {
        $cero = 0;
        $uno = 1;
        $cont = 0;
        $idinvolresp = $idusuariocrea . $cero;
        $idinvolejec = $idusuariocrea . $uno;
        $arrayinvolresp = DatArcDatInvolucrados::ExisteInvolucradoConArc(
            $idinvolresp
        );
        if ($arrayinvolresp) {
            foreach ($arrayinvolresp as $involresp) {
                $arrayrelacioninvol[$cont]['idinvolucrado']
                    = $involresp['idinvolucrado'];
                $arrayrelacioninvol[$cont]['idarc'] = $involresp['idarc'];
                $arrayrelacioninvol[$cont]['nivelinvol'] = 0;
                $cont++;
            }
        }
        $arrayinvolejec = DatArcDatInvolucrados::ExisteInvolucradoConArc(
            $idinvolejec
        );
        if ($arrayinvolejec) {
            foreach ($arrayinvolejec as $involejec) {
                $arrayrelacioninvol[$cont]['idinvolucrado']
                    = $involejec['idinvolucrado'];
                $arrayrelacioninvol[$cont]['idarc'] = $involejec['idarc'];
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
                    = DatArcDatInvolucrados::ExisteInvolucradoConArc(
                    $idinvolresp
                );
                if ($arrayginvolresp) {
                    foreach ($arrayginvolresp as $ginvolresp) {
                        $arrayrelacioninvol[$cont]['idinvolucrado']
                            = $ginvolresp['idinvolucrado'];
                        $arrayrelacioninvol[$cont]['idarc']
                            = $ginvolresp['idarc'];
                        $arrayrelacioninvol[$cont]['nivelinvol'] = 0;
                        $cont++;
                    }
                }
                $arrayginvolejec
                    = DatArcDatInvolucrados::ExisteInvolucradoConArc(
                    $idinvolejec
                );
                if ($arrayginvolejec) {
                    foreach ($arrayginvolejec as $ginvolejec) {
                        $arrayrelacioninvol[$cont]['idinvolucrado']
                            = $ginvolejec['idinvolucrado'];
                        $arrayrelacioninvol[$cont]['idarc']
                            = $ginvolejec['idarc'];
                        $arrayrelacioninvol[$cont]['nivelinvol'] = 1;
                        $cont++;
                    }
                }
            }
        }
        if ($arrayrelacioninvol) {
            foreach ($arrayrelacioninvol as $key => $relacioninvol) {
                $arrayidarcentrante[$key]['idelemento']
                    = $relacioninvol['idarc'];
            }
            $objelentmodel = new DatElementosModel();
            $arrayidarcsaliente = $objelentmodel->ObtenerArregloUnico(
                $arrayidarcentrante, $arrayidarcsaliente
            );
        }
        return $arrayidarcsaliente;
    }

}

