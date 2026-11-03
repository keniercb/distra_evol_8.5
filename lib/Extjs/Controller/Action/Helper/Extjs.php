<?php
class Extjs_Controller_Action_Helper_Extjs extends Zend_Controller_Action_Helper_Abstract {
	
	public function setTransactionsParams($resultData) {
		$result = array ();
        $params = $this->getRequest ()->getParams ();
        if (! $resultData instanceof Exception) {
            $result = $params['extparams'];
            unset($result['data']);
            $result ['result'] = $resultData;
        } else {
            $where = '';
            if (Zend_Registry::get('config')->development)
                $where = $resultData->getTraceAsString();
            $result = array(
                'type' => 'exception',
                'tid' => $params['extparams']['tid'],
                'message' => $resultData->getDescription(),
                'where' => $where
            );
        }
		return $result;
	}
	
	public function addResponseToBody($responseData) {
		$content = Zend_Json::encode ( $responseData, false, array () );
		// The goal here is to make sure we always add with a new ID, currently this doesnt work!
		/**
		 * @todo Fix the check for unique ID in the isset $body[$id]
		 */
		$id = rand ( 1, 100000000000 );
		$body = $this->getResponse ()->getBody ( true );
		while ( isset ( $body [$id] ) ) {
			$id = rand ( 1, 100000000000 );
		}
		return $this->getResponse ()->appendBody ( $content, ( string ) $id );
	}
	
	public function add($resultData) {
		return $this->addResponseToBody ( $this->setTransactionsParams ( $resultData ) );
	}

}
?>