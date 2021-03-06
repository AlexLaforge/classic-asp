require File.dirname(__FILE__) + '/../spec_helper'

describe 'Rack' do

  before(:all){ setup :rack }

  it 'should be able to set the response body' do
    get('/'   ).body.should == 'Hello World'
    get('/foo').body.should == 'Bar!'
  end

  it 'should be able to set the response status code' do
    get('/'         ).code.should == 200
    get('/not-found').code.should == 404
  end

  it 'should be able to set the response headers' do
    get('/'    ).headers['content-type'].should == ['text/html']
    get('/json').headers['content-type'].should == ['application/json']
  end

  it 'should be able to use() middleware'

  it 'should be able to map() for simple routing to multiple applications'

end
