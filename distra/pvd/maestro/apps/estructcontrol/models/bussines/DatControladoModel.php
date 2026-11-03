<?php 
class DatControladoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getControladoByIdcontrolador($idcontrolador)
    {
        $result = DatControlado::getControladoByIdcontrolador($idcontrolador);
        foreach ($result as $val) {
            if (!empty($val['idcargo'])) {
                $arrayId[] = $val['idcargo'];
            }
        }
        $datoscargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($arrayId);
        foreach ($result as $k => $value) {
            $result[$k]['id'] = 'i-'.$value['idcontrolado'];
            $result[$k]['leaf'] = true;
            $result[$k]['text'] = 'Eliminado de la estructura organizativa de la entidad...';
            if (!empty($value['idcargo'])) {
                foreach ($datoscargo as $valor) {
                    if ($valor['idcargo'] == $value['idcargo']) {
                        $result[$k]['text'] = $valor['padre'] . '->' . $valor['denominacion'];
                        $result[$k]['icon'] = $datoscargo[0]->icon;
                        break;
                    }
                }
            } else {
                $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($value['idarea']);
                $result[$k]['text'] = $area[0]->denominacion;
                $result[$k]['icon'] = $area[0]->icon;
            }
        }
        return $result;
    }

    public function add($idcontrolador, $idcargo, $idarea)
    {
        if (empty($idarea)) {
            $resp = DatControlado::getControladoByIdcontroladorCargo($idcontrolador, $idcargo);
        } else {
            $resp = DatControlado::getControladoByIdcontroladorCargo($idcontrolador, $idarea);
        }

        if (count($resp) == 0) {
            $objEstControl = new DatControlado();
            $objEstControl->idcontrolador = $idcontrolador;
            $objEstControl->idcargo = (empty($idcargo))?null:$idcargo;
            $objEstControl->idarea = (empty($idarea))?null:$idarea;
            $objEstControl->save();
            return true;
        } else
            return false;
    }

    public function cambiar($idcontrolador, $idcontrolado)
    {
        try {
            $objcontlado = DatControlado::getById($idcontrolado);
            if ($idcontrolador != $idcontrolado) {
                $resp = DatControlado::getControladoByIdcontroladorCargo($idcontrolador, $objcontlado->idcargo);
                if (count($resp) == 0) {
                    $objcontlado->idcontrolador = $idcontrolador;
                    $objcontlado->save();
                } else return false;
            }
            return true;
        } catch(Exception $e) {
            return false;
        }
    }

    public function delete($id)
    {
        try{
            $objControl = DatControlado::getById($id);
            $objControl->delete();
            return true;
        } catch(Exception $e){
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}
