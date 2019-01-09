# @lancercomet/async-request

Make http requests by using axios in the @Decorator way.

## Quick Start

```typescript
import { Injectable } from '@vert/core'
import { asyncRequestFactory, IAsyncRequestResult } from '@lancercomet/async-request'
import { Account } from '../model'

const AsyncRequest = asyncRequestFactory()

@Injectable()
class UserService {
  @AsyncRequest({
    url: '/user/v1/data',
    onError (error) {
      this.toast.error('Failed to fetch user data, please try again.')
      this.logger.error('Failed to fetch user data:', error)
    }
  })
  async getUserData (data: { id: number }): Promise<IAsyncRequestResult<Account>> {
    return null
  }

  @AsyncRequest({
    url: '/user/v1/data',
    method: 'post',
    onSuccess (response) {
      this.toast.success('User data has been updated.')
    },
    onError (error) {
      this.toast.error('Failed to update user data, please try again.')
      this.logger.error('Failed to update user data:', error)
    }
  })
  async updateUserData (data: Account): Promise<IAsyncRequestResult<void>> {
    return null
  }

  constructor (
    private toast: Toast,
    private logger: Logger
  ) {
  }
}

export {
  UserService
}
```

```typescript
import { AppComponent, Component } from '@vert/core'
import { UserService } from '../services'
import { Account } from '../model'

@Component
export default class UserPanel extends AppComponent {
  private inProcess: boolean = false
  private userData: Account = null

  private async getUserData (id: number) {
    this.inProcess = true
    const { data, error } = await this.userService.getUserData({ id })
    this.inProcess = false

    if (!error) {
      this.userData = data
    }
  }

  private async updateUserData () {
    this.inProcess = true
    await this.userService.updateUserData(this.userData)
    this.inProcess = false
  }

  mounted () {
    this.getUserData(this.$route.params.id)
  }

  constructor (
    private userService: UserService
  ) {
    super()
  }
}
```

## API

```typescript

```
