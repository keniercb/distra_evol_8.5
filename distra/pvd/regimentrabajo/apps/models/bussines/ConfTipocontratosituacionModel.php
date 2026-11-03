<?php
class ConfTipocontratosituacionModel extends ZendExt_Model
 {
    protected $ConfTipocontratosituacion;


    function __construct()
    {
        $this->ConfTipocontratosituacion = new ConfTipocontratosituacion();
    }

    public function setUp()
    { 
        parent::ZendExt_Model();

    }

   /* public function addCategoriacausas($idcategoria, $idscausas)
    {
        try {
            $domain = new ConfCategoriacausas();
            $domain->DelCategCausa();
            foreach ($idscausas as $v) {
                $existe = $domain->existe($v, $idcategoria);
                if (count($existe) == 0) {
                    $obj = new ConfCategoriacausas();
                    $obj->idcategoria = $idcategoria;
                    $obj->idcausa = $v;
                    $obj->save();
                }
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function addCategoriaFT($idcategoria, $fondotiempo)
    {
        try {
            $domain = new ConfFondodetiempo();
                $existeFT = $domain->existeFT($idcategoria);
                if (count($existeFT) == 0) {
                    $obj = new ConfFondodetiempo();
                    $obj->idcategoria = $idcategoria;
                    $obj->fondodetiempo = $fondotiempo;
                    $obj->save();
                }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }*/

    public function getTipocontrato()
    {
        $result = $this->ConfTipocontratosituacion->gettipocontrato();
        /*$result = $this->NomCausa->GetLeafs();
        $causasbyconcepto = $this->ConfConceptocausas->getCausas();
        if (!empty($causasbyconcepto)) {
            foreach ($result as $key => $causa) {
                foreach ($causasbyconcepto as $k => $causabyconc) {
                    if ($causa['idcausa'] == $causabyconc['idcausa']) {
                        $result[$key]['check'] = 1;
                        break;
                    } else
                        $result[$key]['check'] = 0;
                }
            }
        }*/

        return $result;
    }

 }
