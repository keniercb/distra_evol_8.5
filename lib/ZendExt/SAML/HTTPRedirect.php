<?php
/**
 * Created by PhpStorm.
 * User: ernesto
 * Date: 30/09/15
 * Time: 13:17
 */

class ZendExt_SAML_HTTPRedirect extends ZendExt_SAML_Binding {

    const DEFLATE = 'urn:oasis:names:tc:SAML:2.0:bindings:URL-Encoding:DEFLATE';

    /**
     * Create the redirect URL for a message.
     *
     * @param  SAML2_Message $message The message.
     * @return string        The URL the user should be redirected to in order to send a message.
     */
    public function getRedirectURL(SAML2\Message $message)
    {
        if ($this->destination === NULL) {
            $destination = $message->getDestination();
        } else {
            $destination = $this->destination;
        }

        $relayState = $message->getRelayState();

        $key = $message->getSignatureKey();

        $msgStr = $message->toUnsignedXML();
        $msgStr = $msgStr->ownerDocument->saveXML($msgStr);

        SAML2\Utils::getContainer()->debugMessage($msgStr, 'out');

        $msgStr = base64_encode(gzdeflate($msgStr));

        if ($message instanceof SAML2\Request) {
            $msg = 'SAMLRequest=';
        } else {
            $msg = 'SAMLResponse=';
        }
        $msg .= urlencode($msgStr);

        if ($relayState !== NULL) {
            $msg .= '&RelayState=' . urlencode($relayState);
        }

        if ($key !== NULL) {
            /* Add the signature. */
            $msg .= '&SigAlg=' . urlencode($key->type);
            $signature = $key->signData($msg);
            $msg .= '&Signature=' . urlencode(base64_encode($signature));
        }

        if (strpos($destination, '?') === FALSE) {
            $destination .= '?' . $msg;
        } else {
            $destination .= '&' . $msg;
        }
        return $destination;
    }

    public function send(SAML2\Message $message)
    {
        $destination = $this->getRedirectURL($message);
        SAML2\Utils::getContainer()->getLogger()->debug('Redirect to ' . strlen($destination) . ' byte URL: ' . $destination);
        return SAML2\Utils::getContainer()->redirect($destination);
    }

    public function receive(Zend_Controller_Request_Http $request,&$signData)
    {
        if($request->get("SAMLRequest")){
            $msg = $request->get("SAMLRequest");
            $sigQuery = 'SAMLRequest=' . urlencode($msg);
        }else{
            $msg = $request->get("SAMLResponse");
            $sigQuery = 'SAMLResponse=' . urlencode($msg);
        }

        if (!isset($msg)) {
            throw new Exception('Missing SAMLRequest or SAMLResponse parameter.');
        }

        $encoding = $request->get("SAMLEncoding") ? $request->get("SAMLEncoding") : self::DEFLATE;
        $msg = base64_decode($msg);
        switch ($encoding) {
            case self::DEFLATE:
                $msg = gzinflate($msg);
                break;
            default:
                throw new Exception('Unknown SAMLEncoding: ' . var_export($encoding, TRUE));
        }

        SAML2\Utils::getContainer()->debugMessage($msg, 'in');

        $document = new DOMDocument();
        $document->loadXML($msg);
        $xml = $document->firstChild;

        $msg = SAML2\Message::fromXML($xml);
        $relayState = $request->get('RelayState');
        if($relayState) {
            $msg->setRelayState($relayState);
            $relayState = '&RelayState=' . urlencode($relayState);
        }

        if ($request->get('Signature')) {
            if (!$request->get('SigAlg')) {
                throw new Exception('Missing signature algorithm.');
            }else{
                $sigAlg = '&SigAlg=' . urlencode($request->get('SigAlg'));
            }

            $signData = array(
                'Signature' => $request->get('Signature'),
                'SigAlg' => $request->get('SigAlg'),
                'Query' => $sigQuery . $relayState . $sigAlg
            );
        }
        return $msg;
    }
}