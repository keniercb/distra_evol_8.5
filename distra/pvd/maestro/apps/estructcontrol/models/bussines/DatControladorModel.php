<?php 
class DatControladorModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getControladorByIdestructuracontrolsimple($idestructuracontrol)
    {
        $result = DatControlador::getControladorByIdestructuracontrolsimple($idestructuracontrol);
        foreach ($result as $val) {
            $arrayId[] = $val['idcargo'];
        }
        $datoscargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($arrayId);
        foreach ($result as $k => $value) {
            $persona = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
                array($value['idpersona']), null, null, null, null, null
            );
            $result[$k]['id'] = 's-'.$value['idcontrolador'];
            $result[$k]['leaf'] = false;
            $result[$k]['text'] = 'Cargo Eliminado ->'.$persona->data[0]['nombreapellidos'];
            foreach ($datoscargo as $valor) {
                if ($valor['idcargo'] == $value['idcargo']) {
                    $result[$k]['text'] =$valor['padre'].'->'.$valor['denominacion'].' ('
                        .$persona->data[0]['nombreapellidos']. ')';
                    $result[$k]['icon'] = $datoscargo[0]->icon;
                    break;
                }
            }
        }
        return $result;
    }

    public function add($idestructuracontrol, $idcargo, $idpersona)
    {
        $resp = DatControlador::getControladorByIdcargoIdpersona($idestructuracontrol, $idcargo, $idpersona);
        if (count($resp) == 0) {
            $objControl = new DatControlador();
            $objControl->idestructuracontrol = $idestructuracontrol;
            $objControl->idcargo = $idcargo;
            $objControl->idpersona = $idpersona;
            $objControl->save();
            return true;
        } else
            return false;
    }

    public function cambiar($idcontrolador, $idcargo, $idpersona)
    {
        try {
            $objcontlador = DatControlador::getById($idcontrolador);
            $resp = DatControlador::getControladorByIdcargoIdpersona(
                $objcontlador->idestructuracontrol,
                $idcargo,
                $idpersona
            );
            if (count($resp) == 0) {
                $objcontlador->idcargo = $idcargo;
                $objcontlador->idpersona = $idpersona;
                $objcontlador->save();
            } else return false;
            return true;
        } catch(Exception $e) {
            return false;
        }
    }


    public function delete($id)
    {
        try{
            $objControl = DatControlador::getById($id);
            $objControl->delete();
            return true;
        } catch(Exception $e){
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

}