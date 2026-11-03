<?php
class ConfCategoriacausasModel extends ZendExt_Model
 {
  
    public function setUp()
    { 
        parent::ZendExt_Model();

    }

    public function addCategoriacausas($idcategoria, $idscausas)
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
    }

 }
