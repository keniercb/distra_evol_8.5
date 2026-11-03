<?php 
class DatInversionestfactModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatInversionestfact $DatInversionestfact) 
    { 
            $DatInversionestfact->save();
    } 
 
   public function Actualizar(DatInversionestfact $DatInversionestfact) 
    { 
            $DatInversionestfact->save();
    } 
 
   public function Eliminar($DatInversionestfact) 
    { 
            $DatInversionestfact->delete();
    }

    public function setVigenteDocFactibilidad($idInversionDoc,$idInversion)
    {
        try {
            //poner el anterior vigente como no vigente
            $docVigente = Doctrine::getTable('DatInversionestfact')->findByDql("idinversion = $idInversion and vigente = 1");
            $docVigenteAnterior = Doctrine::getTable('DatInversionestfact')->find($docVigente->toArray()[0]['idinversionestfact']);
            if($docVigenteAnterior != ''){
                $docVigenteAnterior->vigente = 0;
                $docVigenteAnterior->save();
            }

            //poner el actual como vigente
            $docVigenteActual = Doctrine::getTable('DatInversionestfact')->find($idInversionDoc);
            $docVigenteActual->vigente = 1;
            $docVigenteActual->save();

            $result = array('codgMensaje'=> 1,'mensaje' => 'El documento se ha puesto como vigente');

        } catch (Exception $e) {
            $result = array('codgMensaje'=> 25,'mensaje' => 'Error al intentar poner el documento como vigente');
        }
        return $result;

    }

    public function guardarDocumentoFactibilidad($idInversion, $idDocumento, $nameDocumento) {
        try {

                //buscar un doc con el mismo id
                $objDocFactibilidad = $documento = DatInversionestfact::BuscarDocumentoById($idDocumento);

                if(empty($objDocFactibilidad)){
                    $params['denominacion'] = $nameDocumento;
                    $params['idinversion'] = $idInversion;
                    $params['fechacreacion'] = date( 'd-m-Y' );
                    $params['idcontenido'] = $idDocumento;

                    //si no exite ningun doc de factibilidad guardado , el primero será el vigente
                    $model = new InversionesModel();
                    $result = $model->GetDocumentosFactibilidadByInversion($params);

                    if(empty($result))
                        $params['vigente'] = 1;
                    else
                        $params['vigente'] = 0;
                    $guardar = DatInversionestfact::guardarDocumentoFactibilidad($params);
                    if($guardar)
                        $result = array('codgMensaje'=> 1,'mensaje' => 'El documento se ha adicionado satisfactoriamente');
                    else
                        $result = array('codgMensaje'=> 25,'mensaje' => 'Error al intentar adicionar un documento');
                }else
                    $result = array('codgMensaje'=>2,'mensaje' => 'El documento que intenta adicionar ya existe');


                return $result;
        } catch (Exception $e) {
            return 0;
        }
    }
 }

